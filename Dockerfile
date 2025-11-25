# syntax=docker.io/docker/dockerfile:1

# 使用 Node.js 20 Alpine 版本作为基础镜像
FROM node:20-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm

# 阶段一：依赖安装（只在需要时安装）
FROM base AS deps
# 查看 https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine 了解为什么可能需要 libc6-compat
RUN apk add --no-cache libc6-compat
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
ENV PUPPETEER_CACHE_DIR=/tmp

# 根据首选的包管理器安装依赖
COPY web/package.json web/pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile && \
    pnpm store prune

# 阶段二：构建应用（只在需要时重新构建源代码）
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY web/. .

ENV NEXT_TELEMETRY_DISABLED=1
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
ENV PUPPETEER_CACHE_DIR=/tmp

RUN pnpm run build && \
    rm -rf node_modules && \
    rm -rf ~/.cache && \
    rm -rf .next/cache

# 阶段三：生产环境镜像，复制所有文件并运行 Next.js
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Puppeteer 环境变量配置
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# 创建系统用户和组
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# 修改工作目录的所有者
RUN chown nextjs:nodejs /app

# 复制公共资源和证书文件
COPY --from=builder /app/public ./public

# 自动利用输出跟踪来减少镜像大小
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 切换到非特权用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# server.js 由 next build 从独立输出创建
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
CMD ["node", "server.js"]