# 产品展示网站后端同步 - 设计方案

## 概述

将产品数据和点赞功能从 localStorage 改为服务器端存储，实现多设备同步。

## 架构

```
用户请求 → Nginx (80端口) → 静态页面 / API 转发
                                    ↓
                              Node.js 后端
                                    ↓
                              JSON 文件存储
```

## 技术选型

- **后端**：Node.js + Express（单文件服务）
- **存储**：JSON 文件（products.json + likes.json）
- **部署**：Nginx + Node.js 在同一个 Docker 容器

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/products | 获取产品列表 |
| POST | /api/products | 添加产品 |
| DELETE | /api/products/:id | 删除产品 |
| GET | /api/likes | 获取点赞数据 |
| POST | /api/likes | 点赞/取消点赞 |

## 数据格式

```json
// products.json
[
  {
    "id": "1700000000000",
    "title": "产品标题",
    "description": "产品描述",
    "image": "base64或图片URL",
    "link": "https://...",
    "createdAt": "2026-03-17T..."
  }
]

// likes.json
{
  "productId": 5
}
```

## 修改范围

1. 新增 `server.js` 后端服务
2. 修改 `js/app.js` 改用 API 而不是 localStorage
3. 修改 `Dockerfile` 安装 Node.js
4. 修改 `nginx.conf` 转发 /api 请求到后端
