# 画云间

## 项目介绍

画云间是一个云上的画廊，用户可以上传自己的图片供其他用户浏览以及下载，也可以创建私人空间存储自己上传的图片，并可以对图片进行管理。

## 技术栈

- 前端:Vue3 + Vite + Ant Design Vue + TypeScript + Pinia + Axios + Vue Router
- 后端:NestJS + Prisma + Redis + OSS + MySQL
- 架构: monorepo

## 项目结构

- client: 前端项目
- server: 后端项目
- package.json: 项目依赖
- .gitignore: 忽略文件
- .prettierrc: 代码格式化配置
- .eslintrc.cjs: 代码规范配置
- .commitlint.config.cjs: 提交规范配置
- .editorconfig: 编辑器配置
- .husky: 提交规范配置
- .stylelintrc.json: 样式规范配置
- openapi.config.js: 接口生成配置
- oss.yaml: 阿里云OSS配置
- prisma: 数据库配置

## 项目启动

- 安装依赖

```bash
pnpm in
```

- 启动前后端

```bash
pnpm dev
```

- 启动前端

```bash
pnpm dev:client
```

- 启动后端

```bash
pnpm dev:server
```

## 自动部署

Git 本地没有 `post-push` 钩子，因此仓库内提供的是一个“推送成功后继续构建并上传”的包装命令。

当前部署脚本已经支持前端和后端同时打包、同时上传。

- 复制 `.env.deploy.example` 为 `.env.deploy.local`
- 填写服务器地址、账号以及前后端各自的远程目录
- 执行部署命令

```bash
pnpm push:deploy -- origin main
```

如果代码已经推送完成，只想重新构建并上传，可以执行：

```bash
pnpm deploy:upload
```

支持的关键配置项：

- `DEPLOY_HOST`: 服务器地址，必填
- `DEPLOY_USERNAME`: 登录账号，必填
- `DEPLOY_PASSWORD`: 密码登录时填写
- `DEPLOY_PRIVATE_KEY_PATH`: 私钥登录时填写
- `DEPLOY_TARGETS`: 部署目标，默认可填 `client,server`
- `DEPLOY_CLIENT_BUILD_COMMAND`: 前端构建命令，默认 `pnpm -C client build`
- `DEPLOY_CLIENT_LOCAL_DIR`: 前端待上传目录，默认 `client/dist`
- `DEPLOY_CLIENT_REMOTE_DIR`: 前端远程目录，必填
- `DEPLOY_SERVER_BUILD_COMMAND`: 后端构建命令，默认 `pnpm -C server build`
- `DEPLOY_SERVER_LOCAL_DIR`: 后端待上传目录，默认 `server/dist`
- `DEPLOY_SERVER_REMOTE_DIR`: 后端远程目录，必填
- `DEPLOY_CLIENT_CLEAN_REMOTE` / `DEPLOY_SERVER_CLEAN_REMOTE`: 是否先清空对应远程目录，默认 `false`

如果你只想保留旧的单目录部署方式，脚本仍兼容：继续使用 `DEPLOY_BUILD_COMMAND`、`DEPLOY_LOCAL_DIR`、`DEPLOY_REMOTE_DIR` 即可。
