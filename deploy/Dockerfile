# 使用轻量级 Nginx 镜像
FROM nginx:alpine

# 删除默认配置
RUN rm /etc/nginx/conf.d/default.conf

# 复制网站文件到容器
COPY index.html products.html admin.html /usr/share/nginx/html/
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY images /usr/share/nginx/html/images

# 复制 Nginx 配置
COPY deploy/nginx.conf /etc/nginx/conf.d/

# 暴露端口
EXPOSE 80

# 启动 Nginx（前台运行）
CMD ["nginx", "-g", "daemon off;"]
