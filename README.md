# 画云间（Cloud Gallery）

> 一站式云端画廊与个人空间管理平台，帮助设计师、摄影师以及团队在任何设备上安全存储、管理、审核与分发图片资源。

## 目录

- [项目概览](#项目概览)
  - [项目简介](#项目简介)
  - [核心特性](#核心特性)
  - [技术栈](#技术栈)
  - [项目结构](#项目结构)
- [环境要求](#环境要求)
- [安装与启动](#安装与启动)
  - [克隆仓库](#1-克隆仓库)
  - [安装依赖](#2-安装依赖)
  - [配置环境变量](#3-配置环境变量)
  - [启动开发环境](#4-启动开发环境)
  - [构建与更多脚本](#5-构建与更多脚本)
- [使用指南](#使用指南)
  - [快速开始](#快速开始)
  - [主要功能示例](#主要功能示例)
  - [常用脚本速查](#常用脚本速查)
- [配置与选项说明](#配置与选项说明)
- [常见问题排查](#常见问题排查)
- [贡献与许可证](#贡献与许可证)

## 项目概览

### 项目简介

画云间是一个面向云端的画廊平台。用户可以上传、整理、搜索并分享个人或团队的高质量图片素材，还可以创建私密空间来管理内部素材。系统提供完善的权限、审核与消息通知机制，适用于素材协作、品牌资产库或个人作品集等多种场景。

### 核心特性

| 分类 | 亮点 |
| --- | --- |
| 数字资产管理 | 自定义空间、图片标签、分类、批量上传与下载 |
| 权限与协作 | 空间角色（viewer/editor/admin）、素材审核、消息通知 |
| 性能与体验 | Vite + Vue3 组合式 API、Ant Design Vue 组件体系、Pinia 状态管理 |
| 后端能力 | NestJS 可扩展架构、Prisma + MySQL 存储、Redis 缓存、OSS 对象存储 |
| 工程实践 | Monorepo 管理、TypeScript 全栈、Lint/Format/Commit 规范与自动化 |

### 技术栈

- **前端**：Vue 3 · Vite · TypeScript · Ant Design Vue · Pinia · Axios · Vue Router
- **后端**：NestJS · Prisma · MySQL · Redis · 阿里云 OSS
- **工程化**：pnpm Monorepo · Husky · Commitlint · Prettier · ESLint · Stylelint · OpenAPI 代码生成

### 项目结构

```text
cloud-gallery
├── client/              # 前端应用（Vite + Vue3）
├── server/              # 后端服务（NestJS）
├── package.json         # 根级脚本与依赖
├── pnpm-workspace.yaml  # Monorepo 配置
├── .husky/              # Git hooks
├── .editorconfig        # 编辑器统一配置
└── ...
```

## 环境要求

- **Node.js** ≥ 18.0.0
- **pnpm** ≥ 9.12.1 且 < 10（建议使用 `corepack enable` 启用）
- **MySQL** 8.0+（用于持久化图片、空间、消息等数据）
- **Redis** 6.0+（用于缓存、会话、消息通知）
- **对象存储**：阿里云 OSS 或兼容服务（用于图片原图与缩略图）
- 推荐在 macOS / Linux / WSL2 环境中运行；Windows 原生命令行需确保 `pnpm`、`git` 等命令可用。

## 安装与启动

### 1. 克隆仓库

```bash
git clone <repo-url>
cd cloud-gallery
```

### 2. 安装依赖

使用根目录脚本一次性安装所有子项目依赖：

```bash
pnpm in   # 等价于 pnpm install -r
```

若首次执行 `pnpm` 报错，请先运行 `corepack enable` 并重开终端。

### 3. 配置环境变量

根目录下提供示例文件：

- `client/.env.development`

  ```env
  VITE_APP_BASE_URL=http://localhost:3000
  VITE_APP_API_BASE_URL=/api/v1
  ```

- `server/.env.development`

  ```env
  CORS=http://localhost:5173
  REDIS_PASSWORD=''
  ENV=development
  ```

另外根据实际部署添加以下变量：

| 变量 | 说明 |
| --- | --- |
| `DATABASE_URL` | Prisma 连接字符串，例如 `mysql://user:pass@localhost:3306/gallery` |
| `OSS_*` | OSS 访问密钥、Bucket、Region 等 |
| `PORT` / `HOST` | 后端服务监听地址（可选） |

在开发模式下，可直接复制 `.env.development` 并按需修改；生产部署建议使用 `.env.production` 或 CI/CD 注入方式。

### 4. 启动开发环境

- **同时启动前后端（推荐）**

  ```bash
  pnpm dev
  ```

- **仅启动前端**

  ```bash
  pnpm dev:client
  ```

- **仅启动后端**

  ```bash
  pnpm dev:server
  ```

前端默认运行在 <http://localhost:5173>，后端在 <http://localhost:3000> 并通过 `/api/v1` 提供接口。

### 5. 构建与更多脚本

| 命令 | 功能 |
| --- | --- |
| `pnpm build` | 同时构建 client 与 server（产物位于各自输出目录） |
| `pnpm format` | 运行前后端 Prettier，保持代码风格一致 |
| `pnpm lint` / `pnpm lint:style` | 运行 ESLint / Stylelint |
| `pnpm generate:api` | 基于 OpenAPI 规范生成前端接口 SDK |
| `pnpm generate:db` / `pnpm pull:db` | Prisma 迁移、拉取数据库结构 |
| `pnpm commit` | 使用 Commitizen 生成符合规范的提交信息 |

> **提示**：Husky 会在提交前自动运行 lint / format，请确保本地通过再提交。

## 使用指南

### 快速开始

1. 启动开发环境（见上文）。
2. 打开浏览器访问 `http://localhost:5173`，注册或登录账号。
3. 创建个人空间或使用默认空间，上传示例图片。
4. 设置图片的分类、标签、介绍，并保存。
5. 在空间中体验筛选、搜索、批量下载等功能。
6. 如需演示审核流程，可邀请其他账号加入空间并调整其角色。

### 主要功能示例

| 场景 | 操作步骤 |
| --- | --- |
| 上传与管理图片 | 「上传图片」→ 选择文件 → 填写名称/标签 → 保存 → 在图片列表中查看尺寸、格式、审核状态 |
| 创建私有空间 | 「新建空间」→ 设置容量/成员 → 为不同成员分配 `viewer/editor/admin` 角色 |
| 审核与消息 | 管理员在后台审核图片 → 填写审核意见 → 触发消息通知，用户可在消息中心查看 |
| 多端访问 | 前端自动适配桌面与移动界面，并可通过分享链接为外部访客提供只读访问 |

### 常用脚本速查

```bash
# 安装依赖
pnpm in

# 初始化数据库（示例）
cd server && pnpm prisma migrate dev

# 生成最新接口 SDK
pnpm generate:api
```

## 配置与选项说明

| 所在目录 | 文件 | 作用 |
| --- | --- | --- |
| 根目录 | `.editorconfig` / `.prettierrc` / `.eslintrc.cjs` | 保持编辑器、格式、语法一致 |
| client | `openapi.config.js` | 配置接口代码生成；可指向服务器 swagger 地址 |
| client | `tailwind.config.js` / `postcss.config.js` | 样式工具链配置 |
| server | `prisma/schema.prisma` | 数据模型定义，执行 `pnpm -C server prisma migrate dev` 生效 |
| server | `src/**` | NestJS 模块（认证、空间、图片、消息等） |

若需要自定义构建输出或代理，参考 `client/vite.config.ts` 与 `server/nest-cli.json`。

## 常见问题排查

1. **pnpm: command not found**：运行 `corepack enable`，或从 <https://pnpm.io/installation> 安装。
2. **数据库连接失败**：确认 `DATABASE_URL` 正确、数据库已初始化，并执行 Prisma 迁移：`pnpm -C server prisma migrate dev`。
3. **Redis 未连接**：检查 `REDIS_PASSWORD`、端口及服务是否启动；如本地无密码可保留为空字符串。
4. **OSS 上传失败**：确认已在服务器环境变量中配置 `OSS_ACCESS_KEY_ID`、`OSS_ACCESS_KEY_SECRET`、`OSS_BUCKET`、`OSS_REGION` 等信息，并保证时钟同步。
5. **端口被占用**：在 Windows 可使用 `netstat -ano | findstr 5173` / `3000` 定位进程；在 macOS / Linux 使用 `lsof -i :5173`。

## 贡献与许可证

欢迎提交 Issue 与 Pull Request 来完善画云间。请遵循仓库内的 lint / commit 规范，并在提交前确保所有检查通过。

本项目遵循 **ISC License**。如需商业部署或二次开发，请保留原始版权信息。