#!/usr/bin/env node

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import SftpClient from "ssh2-sftp-client";

const workspaceRoot = process.cwd();
const envFiles = [".env.deploy", ".env.deploy.local"];
const fallbackEnvFile = ".env.deploy.example";

function printHelp() {
    console.log(
        [
            "Usage:",
            "  pnpm push:deploy -- [git push args]",
            "  pnpm deploy:upload",
            "",
            "Options:",
            "  --skip-push    Skip git push and only build + upload",
            "  --help, -h     Show this help message",
            "",
            "Environment files:",
            "  .env.deploy",
            "  .env.deploy.local",
            "",
            "Required variables:",
            "  DEPLOY_HOST",
            "  DEPLOY_USERNAME",
            "  DEPLOY_REMOTE_DIR (legacy single target)",
            "",
            "Authentication:",
            "  DEPLOY_PASSWORD",
            "  or DEPLOY_PRIVATE_KEY_PATH (+ optional DEPLOY_PASSPHRASE)",
            "",
            "Single target mode:",
            "  DEPLOY_PORT=22",
            '  DEPLOY_BUILD_COMMAND="pnpm -F @cloud-gallery/web build"',
            '  DEPLOY_LOCAL_DIR="client/dist"',
            '  DEPLOY_REMOTE_DIR="/var/www/gallery"',
            "  DEPLOY_CLEAN_REMOTE=false",
            "",
            "Parallel client/server mode:",
            "  DEPLOY_TARGETS=client,server",
            '  DEPLOY_CLIENT_BUILD_COMMAND="pnpm -F @cloud-gallery/web build"',
            '  DEPLOY_CLIENT_LOCAL_DIR="client/dist"',
            '  DEPLOY_CLIENT_REMOTE_DIR="/var/www/gallery/client"',
            "  DEPLOY_CLIENT_CLEAN_REMOTE=false",
            '  DEPLOY_SERVER_BUILD_COMMAND="pnpm -C server build"',
            '  DEPLOY_SERVER_LOCAL_DIR="server/dist"',
            '  DEPLOY_SERVER_REMOTE_DIR="/var/www/gallery/server/dist"',
            "  DEPLOY_SERVER_CLEAN_REMOTE=false",
        ].join("\n"),
    );
}

function parseArgs(argv) {
    const pushArgs = [];
    let skipPush = false;
    let showHelp = false;

    for (const arg of argv) {
        if (arg === "--skip-push") {
            skipPush = true;
            continue;
        }

        if (arg === "--help" || arg === "-h") {
            showHelp = true;
            continue;
        }

        pushArgs.push(arg);
    }

    return {
        pushArgs,
        skipPush,
        showHelp,
    };
}

function parseEnvContent(content) {
    const result = {};

    for (const rawLine of content.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith("#")) {
            continue;
        }

        const matched = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
        if (!matched) {
            continue;
        }

        const [, key, valueSource] = matched;
        let value = valueSource.trim();

        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }

        result[key] = value;
    }

    return result;
}

async function loadEnvConfig() {
    const configFromFiles = {};
    const loadedFiles = [];

    for (const fileName of envFiles) {
        const filePath = path.resolve(workspaceRoot, fileName);
        if (!existsSync(filePath)) {
            continue;
        }

        const content = await readFile(filePath, "utf8");
        Object.assign(configFromFiles, parseEnvContent(content));
        loadedFiles.push(fileName);
    }

    if (loadedFiles.length === 0) {
        const fallbackPath = path.resolve(workspaceRoot, fallbackEnvFile);
        if (existsSync(fallbackPath)) {
            const content = await readFile(fallbackPath, "utf8");
            Object.assign(configFromFiles, parseEnvContent(content));
            loadedFiles.push(fallbackEnvFile);
            console.warn(
                `No ${envFiles.join(" or ")} found. Falling back to ${fallbackEnvFile}. ` +
                    "Prefer a local deploy config for real deployments.",
            );
        }
    }

    if (loadedFiles.length === 0) {
        throw new Error(
            `No deployment config file found. Create ${envFiles[1]} from ${fallbackEnvFile}.`,
        );
    }

    return {
        ...configFromFiles,
        ...process.env,
    };
}

function readBoolean(value, defaultValue = false) {
    if (value == null || value === "") {
        return defaultValue;
    }

    return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

function resolveLocalPath(targetPath) {
    if (!targetPath) {
        return "";
    }

    return path.isAbsolute(targetPath)
        ? targetPath
        : path.resolve(workspaceRoot, targetPath);
}

function parseList(value) {
    if (!value) {
        return [];
    }

    return String(value)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

function getTargetEnvPrefix(targetName) {
    const normalizedName = String(targetName)
        .trim()
        .replace(/[^A-Za-z0-9]+/g, "_")
        .toUpperCase();

    return `DEPLOY_${normalizedName}_`;
}

function normalizeRemoteDir(remoteDir, label = "DEPLOY_REMOTE_DIR") {
    const normalized = String(remoteDir || "")
        .replace(/\\/g, "/")
        .replace(/\/+$/, "");
    if (!normalized || normalized === "/") {
        throw new Error(`${label} must not be empty or root (/).`);
    }
    return normalized;
}

async function ensureDirectoryExists(dirPath, label) {
    const info = await stat(dirPath).catch(() => null);
    if (!info || !info.isDirectory()) {
        throw new Error(
            `${label} does not exist or is not a directory: ${dirPath}`,
        );
    }
}

function requireValue(config, key) {
    const value = config[key];
    if (!value) {
        throw new Error(`Missing required config: ${key}`);
    }
    return value;
}

function runProcess(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd: workspaceRoot,
            stdio: "inherit",
            shell: false,
            ...options,
        });

        child.on("error", reject);
        child.on("exit", (code) => {
            if (code === 0) {
                resolve();
                return;
            }
            reject(
                new Error(`${command} exited with code ${code ?? "unknown"}`),
            );
        });
    });
}

function runShellCommand(command) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, {
            cwd: workspaceRoot,
            stdio: "inherit",
            shell: true,
        });

        child.on("error", reject);
        child.on("exit", (code) => {
            if (code === 0) {
                resolve();
                return;
            }
            reject(
                new Error(
                    `Command exited with code ${code ?? "unknown"}: ${command}`,
                ),
            );
        });
    });
}

function createLegacyTarget(config) {
    return {
        name: "deploy",
        buildCommand:
            config.DEPLOY_BUILD_COMMAND || "pnpm -F @cloud-gallery/web build",
        localDir: resolveLocalPath(config.DEPLOY_LOCAL_DIR || "client/dist"),
        remoteDir: normalizeRemoteDir(
            requireValue(config, "DEPLOY_REMOTE_DIR"),
            "DEPLOY_REMOTE_DIR",
        ),
        cleanRemote: readBoolean(config.DEPLOY_CLEAN_REMOTE, false),
    };
}

function createNamedTarget(config, targetName, requireRemoteDir = false) {
    const prefix = getTargetEnvPrefix(targetName);
    const remoteDirValue = config[`${prefix}REMOTE_DIR`];

    if (!remoteDirValue) {
        if (requireRemoteDir) {
            throw new Error(`Missing required config: ${prefix}REMOTE_DIR`);
        }
        return null;
    }

    return {
        name: targetName,
        buildCommand:
            config[`${prefix}BUILD_COMMAND`] || `pnpm -C ${targetName} build`,
        localDir: resolveLocalPath(
            config[`${prefix}LOCAL_DIR`] || `${targetName}/dist`,
        ),
        remoteDir: normalizeRemoteDir(remoteDirValue, `${prefix}REMOTE_DIR`),
        cleanRemote: readBoolean(config[`${prefix}CLEAN_REMOTE`], false),
    };
}

function resolveTargets(config) {
    const explicitTargets = parseList(config.DEPLOY_TARGETS);
    if (explicitTargets.length > 0) {
        return explicitTargets.map((targetName) =>
            createNamedTarget(config, targetName, true),
        );
    }

    const namedTargets = [
        createNamedTarget(config, "client"),
        createNamedTarget(config, "server"),
    ].filter(Boolean);

    if (namedTargets.length > 0) {
        return namedTargets;
    }

    return [createLegacyTarget(config)];
}

async function createConnection(config) {
    const connection = {
        host: requireValue(config, "DEPLOY_HOST"),
        port: Number(config.DEPLOY_PORT || 22),
        username: requireValue(config, "DEPLOY_USERNAME"),
    };

    const password = config.DEPLOY_PASSWORD;
    const privateKeyPath = config.DEPLOY_PRIVATE_KEY_PATH;

    if (privateKeyPath) {
        connection.privateKey = await readFile(
            resolveLocalPath(privateKeyPath),
            "utf8",
        );
    }

    if (config.DEPLOY_PASSPHRASE) {
        connection.passphrase = config.DEPLOY_PASSPHRASE;
    }

    if (password) {
        connection.password = password;
    }

    if (!connection.password && !connection.privateKey) {
        throw new Error(
            "Set DEPLOY_PASSWORD or DEPLOY_PRIVATE_KEY_PATH for authentication.",
        );
    }

    return connection;
}

async function buildTarget(target) {
    console.log(`[${target.name}] Building with: ${target.buildCommand}`);
    await runShellCommand(target.buildCommand);
    await ensureDirectoryExists(
        target.localDir,
        `${target.name} local build output`,
    );
    console.log(`[${target.name}] Build completed.`);
}

async function uploadTarget(connection, target) {
    const sftp = new SftpClient(target.name);

    try {
        console.log(`[${target.name}] Uploading to ${target.remoteDir}`);
        await sftp.connect({ ...connection });

        const remoteExists = await sftp.exists(target.remoteDir);
        if (target.cleanRemote && remoteExists) {
            await sftp.rmdir(target.remoteDir, true);
        }

        if (!(await sftp.exists(target.remoteDir))) {
            await sftp.mkdir(target.remoteDir, true);
        }

        const uploaded = await sftp.uploadDir(
            target.localDir,
            target.remoteDir,
        );
        if (!uploaded) {
            throw new Error(`[${target.name}] Upload failed.`);
        }

        console.log(`[${target.name}] Upload completed.`);
    } finally {
        await sftp.end().catch(() => undefined);
    }
}

async function buildAndUpload(config) {
    const targets = resolveTargets(config);
    const connection = await createConnection(config);

    await Promise.all(targets.map((target) => buildTarget(target)));
    await Promise.all(
        targets.map((target) => uploadTarget(connection, target)),
    );
}

async function main() {
    const { pushArgs, skipPush, showHelp } = parseArgs(process.argv.slice(2));
    if (showHelp) {
        printHelp();
        return;
    }

    const config = await loadEnvConfig();

    if (!skipPush) {
        await runProcess("git", ["push", ...pushArgs]);
    }

    await buildAndUpload(config);
    console.log("Deploy finished.");
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
