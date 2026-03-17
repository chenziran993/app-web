# 基础镜像
FROM node:18-alpine AS builder

# 创建数据目录
RUN mkdir -p /data

# ============ 第一阶段：构建后端 ============
WORKDIR /app
COPY server/package.json ./
RUN npm install --production --registry=https://registry.npmmirror.com

# ============ 第二阶段：运行 ============
FROM node:18-alpine

# 切换到阿里云镜像源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 安装 nginx
RUN apk add --no-cache nginx

# 创建数据目录
RUN mkdir -p /data

# 复制后端文件
COPY --from=builder /app /app
COPY server/server.js /app/

# 复制网站文件
COPY index.html products.html admin.html /usr/share/nginx/html/
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js

# 复制 Nginx 配置（替换主配置）
COPY deploy/nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动脚本
RUN printf '#!/bin/sh\nnode /app/server.js &\nnginx -g "daemon off;"' > /start.sh && chmod +x /start.sh

CMD ["/start.sh"]
