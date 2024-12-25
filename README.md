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
