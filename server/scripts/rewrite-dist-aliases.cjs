/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs')
const path = require('node:path')

const serverRoot = __dirname.includes(`${path.sep}scripts`)
    ? path.resolve(__dirname, '..')
    : path.resolve(process.cwd(), 'server')
const distRoot = path.join(serverRoot, 'dist')

const aliasToDistDir = {
    '@core/': path.join(distRoot, 'core'),
    '@shared/': path.join(distRoot, 'shared'),
    '@infra/': path.join(distRoot, 'infrastructure'),
    '@identity/': path.join(distRoot, 'modules', 'identity'),
    '@gallery/': path.join(distRoot, 'modules', 'gallery'),
    '@space/': path.join(distRoot, 'modules', 'space'),
    '@tools/': path.join(distRoot, 'modules', 'tools')
}

function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    const files = []
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
            files.push(...walk(fullPath))
        } else {
            files.push(fullPath)
        }
    }
    return files
}

function getAliasTarget(specifier) {
    for (const [aliasPrefix, distDir] of Object.entries(aliasToDistDir)) {
        if (specifier.startsWith(aliasPrefix)) {
            return path.join(distDir, specifier.slice(aliasPrefix.length))
        }
    }
    return null
}

function resolveTargetPath(targetBase) {
    const fileCandidates = ['.js', '.d.ts', '.json']
    for (const ext of fileCandidates) {
        if (fs.existsSync(`${targetBase}${ext}`)) {
            return targetBase
        }
    }

    const indexCandidates = ['index.js', 'index.d.ts', 'index.json']
    for (const filename of indexCandidates) {
        const indexFile = path.join(targetBase, filename)
        if (fs.existsSync(indexFile)) {
            return targetBase
        }
    }

    return null
}

function toPosixRelative(fromFile, targetBase) {
    let relativePath = path.relative(path.dirname(fromFile), targetBase).replace(/\\/g, '/')
    if (!relativePath.startsWith('.')) {
        relativePath = `./${relativePath}`
    }
    return relativePath
}

function rewriteSpecifier(filePath, specifier) {
    const targetBase = getAliasTarget(specifier)
    if (!targetBase) {
        return specifier
    }

    const resolvedTarget = resolveTargetPath(targetBase)
    if (!resolvedTarget) {
        return specifier
    }

    return toPosixRelative(filePath, resolvedTarget)
}

function rewriteContent(filePath, content) {
    const patterns = [
        /(from\s+['"])(@(?:core|shared|infra|identity|gallery|space|tools)\/[^'"]+)(['"])/g,
        /(require\(\s*['"])(@(?:core|shared|infra|identity|gallery|space|tools)\/[^'"]+)(['"]\s*\))/g,
        /(^\s*import\s+['"])(@(?:core|shared|infra|identity|gallery|space|tools)\/[^'"]+)(['"])/gm,
        /(import\(\s*['"])(@(?:core|shared|infra|identity|gallery|space|tools)\/[^'"]+)(['"]\s*\))/g
    ]

    let next = content
    for (const pattern of patterns) {
        next = next.replace(pattern, (match, prefix, specifier, suffix) => {
            return prefix + rewriteSpecifier(filePath, specifier) + suffix
        })
    }
    return next
}

if (!fs.existsSync(distRoot)) {
    process.exit(0)
}

const distFiles = walk(distRoot).filter(file => file.endsWith('.js') || file.endsWith('.d.ts'))

for (const filePath of distFiles) {
    const original = fs.readFileSync(filePath, 'utf8')
    const rewritten = rewriteContent(filePath, original)
    if (rewritten !== original) {
        fs.writeFileSync(filePath, rewritten, 'utf8')
    }
}
