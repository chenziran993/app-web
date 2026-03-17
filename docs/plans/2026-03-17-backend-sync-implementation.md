# 后端同步功能实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将产品数据和点赞功能从 localStorage 改为服务器端存储，实现多设备同步

**Architecture:** Nginx + Node.js(Express) 在同一容器，JSON 文件存储

**Tech Stack:** Node.js, Express, JSON 文件存储

---

## 实现步骤

### Task 1: 创建后端 server.js

**Files:**
- Create: `server/server.js`

**Step 1: 创建后端服务**

```javascript
// server/server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || '/data';

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 数据文件路径
const productsFile = path.join(DATA_DIR, 'products.json');
const likesFile = path.join(DATA_DIR, 'likes.json');

// 初始化数据文件
function initDataFile(filePath, defaultData) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
}

// 读取数据
function readData(filePath, defaultData = []) {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return defaultData;
    }
}

// 写入数据
function writeData(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// 初始化
initDataFile(productsFile, []);
initDataFile(likesFile, {});

// ============ 产品 API ============

// 获取产品列表
app.get('/api/products', (req, res) => {
    const products = readData(productsFile);
    const likes = readData(likesFile, {});

    // 合并点赞数
    const result = products.map(p => ({
        ...p,
        likes: likes[p.id] || 0
    }));

    res.json(result);
});

// 添加产品
app.post('/api/products', (req, res) => {
    const { title, description, image, link } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    const products = readData(productsFile);
    const newProduct = {
        id: Date.now().toString(),
        title,
        description,
        image: image || '',
        link: link || '',
        createdAt: new Date().toISOString()
    };

    products.unshift(newProduct);
    writeData(productsFile, products);

    res.json(newProduct);
});

// 删除产品
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const products = readData(productsFile);
    const filtered = products.filter(p => p.id !== id);

    writeData(productsFile, filtered);

    res.json({ success: true });
});

// ============ 点赞 API ============

// 获取点赞数据
app.get('/api/likes', (req, res) => {
    const likes = readData(likesFile, {});
    res.json(likes);
});

// 点赞/取消点赞
app.post('/api/likes', (req, res) => {
    const { productId, action } = req.body;

    if (!productId) {
        return res.status(400).json({ error: 'productId is required' });
    }

    const likes = readData(likesFile, {});

    if (action === 'like') {
        likes[productId] = (likes[productId] || 0) + 1;
    } else if (action === 'unlike') {
        likes[productId] = Math.max(0, (likes[productId] || 0) - 1);
    }

    writeData(likesFile, likes);

    res.json({ success: true, likes: likes[productId] });
});

// 启动服务器
app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server running on port ${PORT}`);
});
```

**Step 2: 提交**

```bash
git add server/server.js
git commit -m "feat: 添加后端服务 server.js"
```

---

### Task 2: 修改 js/app.js 使用 API

**Files:**
- Modify: `js/app.js`

**Step 1: 修改配置，添加 API 地址**

```javascript
// 在 CONFIG 中添加
const CONFIG = {
    API_BASE: '/api',  // 使用相对路径，Nginx 会转发
    STORAGE_KEYS: {
        // ... 保持不变
    },
    MIN_PASSWORD_LENGTH: 4
};
```

**Step 2: 修改 products 模块使用 API**

```javascript
const products = {
    async getProducts() {
        try {
            const res = await fetch(CONFIG.API_BASE + '/products');
            return await res.json();
        } catch (e) {
            console.error('Error fetching products:', e);
            // 降级到 localStorage
            const products = getItem(CONFIG.STORAGE_KEYS.PRODUCTS);
            return products || [];
        }
    },

    async addProduct(product) {
        try {
            const res = await fetch(CONFIG.API_BASE + '/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            return await res.json();
        } catch (e) {
            console.error('Error adding product:', e);
            // 降级到 localStorage
            const newProduct = {
                id: generateId(),
                title: product.title || '',
                description: product.description || '',
                image: product.image || '',
                link: product.link || '',
                likes: 0,
                createdAt: new Date().toISOString()
            };
            const products = getItem(CONFIG.STORAGE_KEYS.PRODUCTS) || [];
            products.unshift(newProduct);
            setItem(CONFIG.STORAGE_KEYS.PRODUCTS, products);
            return newProduct;
        }
    },

    async deleteProduct(id) {
        try {
            await fetch(CONFIG.API_BASE + '/products/' + id, {
                method: 'DELETE'
            });
        } catch (e) {
            console.error('Error deleting product:', e);
            // 降级到 localStorage
            const products = getItem(CONFIG.STORAGE_KEYS.PRODUCTS) || [];
            const filtered = products.filter(p => p.id !== id);
            setItem(CONFIG.STORAGE_KEYS.PRODUCTS, filtered);
        }
    }
};
```

**Step 3: 修改 likes 模块使用 API**

```javascript
const likes = {
    async getLikes() {
        try {
            const res = await fetch(CONFIG.API_BASE + '/likes');
            return await res.json();
        } catch (e) {
            console.error('Error fetching likes:', e);
            return getItem(CONFIG.STORAGE_KEYS.LIKES) || {};
        }
    },

    async likeProduct(productId) {
        try {
            const res = await fetch(CONFIG.API_BASE + '/likes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, action: 'like' })
            });
            const data = await res.json();

            // 本地记录已点赞
            const likedProducts = this.getLikedProducts();
            if (!likedProducts.includes(productId)) {
                likedProducts.push(productId);
                localStorage.setItem('xundao_liked_products', JSON.stringify(likedProducts));
            }

            return { success: true, likes: data.likes };
        } catch (e) {
            console.error('Error liking product:', e);
            // 降级到 localStorage
            const allLikes = this.getLikes();
            allLikes[productId] = (allLikes[productId] || 0) + 1;
            this.saveLikes(allLikes);
            return { success: true, likes: allLikes[productId] };
        }
    },

    getLikedProducts() {
        try {
            const liked = localStorage.getItem('xundao_liked_products');
            return liked ? JSON.parse(liked) : [];
        } catch (e) {
            return [];
        }
    },

    getLikes() {
        const likes = getItem(CONFIG.STORAGE_KEYS.LIKES);
        return likes || {};
    },

    saveLikes(likes) {
        return setItem(CONFIG.STORAGE_KEYS.LIKES, likes);
    },

    getProductLikes(productId) {
        const allLikes = this.getLikes();
        return allLikes[productId] || 0;
    },

    hasLiked(productId) {
        const likedProducts = this.getLikedProducts();
        return likedProducts.includes(productId);
    }
};
```

**Step 4: 提交**

```bash
git add js/app.js
git commit -m "feat: 修改 app.js 使用后端 API"
```

---

### Task 3: 修改 Dockerfile

**Files:**
- Modify: `deploy/Dockerfile`

**Step 1: 更新 Dockerfile**

```dockerfile
# 基础镜像
FROM node:18-alpine AS builder

# 创建数据目录
RUN mkdir -p /data

# ============ 第一阶段：构建后端 ============
WORKDIR /app
COPY server/package.json ./
RUN npm install --production

# ============ 第二阶段：运行 ============
FROM node:18-alpine

# 安装 nginx
RUN apk add --no-cache nginx

# 创建数据目录
RUN mkdir -p /data

# 复制后端文件
COPY --from=builder /app /app
COPY server/server.js ./

# 复制网站文件
COPY index.html products.html admin.html /usr/share/nginx/html/
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js

# 复制 Nginx 配置
COPY deploy/nginx.conf /etc/nginx/conf.d/

# 暴露端口
EXPOSE 80

# 启动脚本
RUN echo '#!/bin/sh\n\
node /app/server.js &\n\
nginx -g "daemon off;"' > /start.sh && chmod +x /start.sh

CMD ["/start.sh"]
```

**Step 2: 创建 server/package.json**

```json
{
    "name": "xundao-server",
    "version": "1.0.0",
    "main": "server.js",
    "dependencies": {
        "express": "^4.18.2",
        "cors": "^2.8.5"
    }
}
```

**Step 3: 提交**

```bash
git add deploy/Dockerfile server/package.json
git commit -m "feat: 修改 Dockerfile 支持 Node.js 后端"
```

---

### Task 4: 修改 nginx.conf

**Files:**
- Modify: `deploy/nginx.conf`

**Step 1: 更新 nginx 配置**

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # API 转发到后端
    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 支持所有页面直接访问
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg)$ {
        expires 30d;
    }
}
```

**Step 2: 提交**

```bash
git add deploy/nginx.conf
git commit -m "feat: 修改 nginx.conf 转发 API 请求"
```

---

### Task 5: 部署测试

**Step 1: 推送代码到 GitHub**

```bash
git push
```

**Step 2: 服务器上部署**

```bash
cd /root
rm -rf app-web
git clone https://github.com/chenziran993/app-web.git
cd app-web
docker build -t xundao-website -f deploy/Dockerfile .
docker stop xundao-website || true
docker rm xundao-website || true
docker run -d --name xundao-website -p 80:80 xundao-website
```

**Step 3: 测试**

- 访问 http://182.92.171.8
- 在一个设备添加产品
- 在另一个设备刷新页面，确认产品同步显示
- 测试点赞功能是否同步

---

**Plan complete and saved to `docs/plans/2026-03-17-backend-sync-implementation.md`**

**Two execution options:**

1. **Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

2. **Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach?
