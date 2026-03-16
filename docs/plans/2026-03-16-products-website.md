# 产品展示网站 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 创建两个新页面（产品展示页 + 管理员后台），**完全参考现有 index.html 的水墨风格设计**

**Architecture:** 多页面 SPA 架构，共享 CSS 和 JS，数据存储在 localStorage

**Tech Stack:** HTML + CSS + JavaScript + Three.js (WebGL)

**重要：** 所有新页面必须使用与 index.html **完全相同**的设计规范：
- 布局结构：margin-band + canvas-area + content-layer
- 配色方案：--paper, --ink, --ink-light
- 字体：Noto Serif SC, Cormorant Garamond
- 导航：左侧，hover 下划线动画
- WebGL：水墨风格 shader

---

## 文件结构
```
├── docs/plans/2026-03-16-products-website.md  # 本计划
├── index.html          # 欢迎页 (现有，保留)
├── products.html      # 产品展示页 (新建)
├── admin.html         # 管理员后台 (新建)
├── css/
│   └── style.css     # 共享样式
├── js/
│   └── app.js        # 共享脚本
└── images/           # 产品图片目录
```

---

### Task 1: 创建共享样式文件 (css/style.css)

**Files:**
- Create: `css/style.css`

**Step 1: 创建 CSS 文件**

```css
/* 寻道 - 共享样式 */

/* CSS 变量 */
:root {
    --paper: #F4F2EC;
    --ink: #2A2927;
    --ink-light: #5A5855;
    --slate: #8A8B86;
    --umber: #6A5C52;
    --mist: #A3ADAA;
    --white: #EBEBE6;
}

/* 基础重置 */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body, html {
    width: 100%;
    height: 100%;
    background-color: var(--paper);
    color: var(--ink);
    font-family: 'Noto Serif SC', 'Cormorant Garamond', serif;
    overflow-x: hidden;
}

a {
    text-decoration: none;
    color: inherit;
}

/* 导航栏 */
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 1.5rem 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 100;
    background: linear-gradient(to bottom, var(--paper), transparent);
}

.nav-logo {
    font-size: 1.5rem;
    letter-spacing: 0.3em;
}

.nav-links {
    display: flex;
    gap: 2rem;
}

.nav-link {
    font-size: 0.9rem;
    letter-spacing: 0.2em;
    position: relative;
    transition: opacity 0.3s ease;
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 1px;
    background-color: var(--ink);
    transition: width 0.4s ease;
}

.nav-link:hover::after {
    width: 100%;
}

/* 按钮样式 */
.btn {
    padding: 0.8rem 2rem;
    border: 1px solid var(--ink);
    background: transparent;
    color: var(--ink);
    font-family: inherit;
    font-size: 0.9rem;
    letter-spacing: 0.2em;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn:hover {
    background: var(--ink);
    color: var(--paper);
}

.btn-primary {
    background: var(--ink);
    color: var(--paper);
}

.btn-primary:hover {
    background: var(--ink-light);
}

/* 输入框样式 */
.input {
    width: 100%;
    padding: 0.8rem 1rem;
    border: 1px solid var(--slate);
    background: var(--paper);
    color: var(--ink);
    font-family: inherit;
    font-size: 1rem;
}

.input:focus {
    outline: none;
    border-color: var(--ink);
}

textarea.input {
    min-height: 120px;
    resize: vertical;
}

/* 卡片网格 */
.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

/* 产品卡片 */
.product-card {
    background: var(--paper);
    border: 1px solid var(--slate);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(42, 41, 39, 0.15);
}

.product-image {
    width: 100%;
    aspect-ratio: 4/3;
    object-fit: cover;
    display: block;
}

.product-info {
    padding: 1.5rem;
}

.product-title {
    font-size: 1.2rem;
    letter-spacing: 0.1em;
    margin-bottom: 0.5rem;
}

.product-desc {
    font-size: 0.9rem;
    color: var(--ink-light);
    line-height: 1.6;
    margin-bottom: 1rem;
}

.product-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.like-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid var(--slate);
    background: transparent;
    color: var(--ink);
    cursor: pointer;
    transition: all 0.3s ease;
}

.like-btn:hover {
    border-color: var(--ink);
}

.like-btn.liked {
    background: var(--ink);
    color: var(--paper);
    border-color: var(--ink);
}

.link-btn {
    padding: 0.5rem 1rem;
    border: 1px solid var(--slate);
    color: var(--ink);
    transition: all 0.3s ease;
}

.link-btn:hover {
    background: var(--ink);
    color: var(--paper);
}

/* 页面容器 */
.container {
    min-height: 100vh;
    padding-top: 80px;
}

.page-title {
    text-align: center;
    font-size: 2rem;
    letter-spacing: 0.5em;
    margin: 3rem 0;
    font-weight: 300;
}

/* 管理后台 */
.admin-panel {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    letter-spacing: 0.1em;
}

.form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
}

/* 产品列表 */
.product-list {
    margin-top: 3rem;
}

.product-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border: 1px solid var(--slate);
    margin-bottom: 1rem;
}

.product-item-info {
    flex: 1;
}

.delete-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #c00;
    background: transparent;
    color: #c00;
    cursor: pointer;
    transition: all 0.3s ease;
}

.delete-btn:hover {
    background: #c00;
    color: white;
}

/* 登录页 */
.login-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-form {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
}

.login-title {
    text-align: center;
    font-size: 1.5rem;
    letter-spacing: 0.3em;
    margin-bottom: 2rem;
}

.error-msg {
    color: #c00;
    font-size: 0.9rem;
    margin-top: 0.5rem;
}

/* 底部 */
.footer {
    text-align: center;
    padding: 2rem;
    color: var(--ink-light);
    font-size: 0.8rem;
    letter-spacing: 0.1em;
}

/* 响应式 */
@media (max-width: 768px) {
    .navbar {
        padding: 1rem;
    }

    .nav-links {
        gap: 1rem;
    }

    .product-grid {
        grid-template-columns: 1fr;
        padding: 1rem;
    }
}
```

**Step 2: 验证文件创建**

Run: 检查文件是否存在
Expected: `css/style.css` 文件已创建

---

### Task 2: 创建共享脚本文件 (js/app.js)

**Files:**
- Create: `js/app.js`

**Step 1: 创建 JavaScript 文件**

```javascript
/**
 * 寻道 - 共享脚本
 * 产品展示网站核心功能
 */

// ==================== 配置 ====================
const CONFIG = {
    STORAGE_KEYS: {
        PRODUCTS: 'xundao_products',
        LIKES: 'xundao_likes',
        ADMIN_PASSWORD: 'xundao_admin_password',
        ADMIN_LOGGED_IN: 'xundao_admin_logged_in'
    }
};

// ==================== 产品管理 ====================

/**
 * 获取产品列表
 */
function getProducts() {
    const data = localStorage.getItem(CONFIG.STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
}

/**
 * 保存产品列表
 */
function saveProducts(products) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

/**
 * 添加产品
 */
function addProduct(product) {
    const products = getProducts();
    const newProduct = {
        id: Date.now().toString(),
        title: product.title,
        description: product.description,
        image: product.image, // Base64 编码
        link: product.link || '',
        likes: 0,
        createdAt: new Date().toISOString()
    };
    products.unshift(newProduct);
    saveProducts(products);
    return newProduct;
}

/**
 * 删除产品
 */
function deleteProduct(id) {
    const products = getProducts();
    const filtered = products.filter(p => p.id !== id);
    saveProducts(filtered);
}

/**
 * 获取单个产品
 */
function getProduct(id) {
    const products = getProducts();
    return products.find(p => p.id === id);
}

// ==================== 点赞功能 ====================

/**
 * 获取点赞数据
 */
function getLikes() {
    const data = localStorage.getItem(CONFIG.STORAGE_KEYS.LIKES);
    return data ? JSON.parse(data) : {};
}

/**
 * 保存点赞数据
 */
function saveLikes(likes) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.LIKES, JSON.stringify(likes));
}

/**
 * 获取产品点赞数
 */
function getProductLikes(productId) {
    const likes = getLikes();
    return likes[productId] || 0;
}

/**
 * 点赞产品
 */
function likeProduct(productId) {
    // 检查是否已点赞
    if (hasLiked(productId)) {
        return { success: false, message: '已点赞' };
    }

    const likes = getLikes();
    likes[productId] = (likes[productId] || 0) + 1;
    saveLikes(likes);

    // 记录点赞状态
    const likedProducts = getLikedProducts();
    likedProducts.push(productId);
    localStorage.setItem('xundao_liked_products', JSON.stringify(likedProducts));

    return { success: true, likes: likes[productId] };
}

/**
 * 获取已点赞的产品列表
 */
function getLikedProducts() {
    const data = localStorage.getItem('xundao_liked_products');
    return data ? JSON.parse(data) : [];
}

/**
 * 检查是否已点赞
 */
function hasLiked(productId) {
    const likedProducts = getLikedProducts();
    return likedProducts.includes(productId);
}

// ==================== 管理员功能 ====================

/**
 * 检查是否已设置密码
 */
function hasPassword() {
    return !!localStorage.getItem(CONFIG.STORAGE_KEYS.ADMIN_PASSWORD);
}

/**
 * 设置管理员密码（首次）
 */
function setPassword(password) {
    if (!password || password.length < 4) {
        return { success: false, message: '密码至少4位' };
    }
    localStorage.setItem(CONFIG.STORAGE_KEYS.ADMIN_PASSWORD, password);
    return { success: true };
}

/**
 * 验证管理员密码
 */
function verifyPassword(password) {
    const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.ADMIN_PASSWORD);
    return stored === password;
}

/**
 * 管理员登录
 */
function adminLogin(password) {
    if (!hasPassword()) {
        // 首次设置密码
        const result = setPassword(password);
        if (result.success) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.ADMIN_LOGGED_IN, 'true');
            return { success: true, message: '密码已设置并登录成功' };
        }
        return result;
    }

    if (verifyPassword(password)) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.ADMIN_LOGGED_IN, 'true');
        return { success: true };
    }

    return { success: false, message: '密码错误' };
}

/**
 * 检查管理员登录状态
 */
function isAdminLoggedIn() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.ADMIN_LOGGED_IN) === 'true';
}

/**
 * 管理员退出
 */
function adminLogout() {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.ADMIN_LOGGED_IN);
}

/**
 * 图片转 Base64
 */
function imageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ==================== 初始化默认数据 ====================

/**
 * 初始化示例数据（仅当没有数据时）
 */
function initSampleData() {
    if (getProducts().length === 0) {
        const sampleProducts = [
            {
                id: '1',
                title: '示例产品一',
                description: '这是一个示例产品，展示水墨风格的卡片效果。',
                image: '',
                link: 'https://example.com/product1',
                likes: 0,
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                title: '示例产品二',
                description: '点击跳转链接可以访问产品详情页面。',
                image: '',
                link: 'https://example.com/product2',
                likes: 0,
                createdAt: new Date().toISOString()
            }
        ];
        saveProducts(sampleProducts);
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', initSampleData);
```

**Step 2: 验证文件创建**

Run: 检查文件是否存在
Expected: `js/app.js` 文件已创建

---

### Task 3: 创建产品展示页 (products.html)

**Files:**
- Create: `products.html`

**设计要求：** 完全参考 index.html 的水墨风格，包括：
- margin-band 上下留白布局
- 水墨风格 WebGL 背景 (使用相同的 shader)
- 左侧导航 (hover 下划线动画)
- 竖排中文标题
- 页面内容使用 .content-layer 浮在 WebGL 之上

**Step 1: 创建 HTML 文件（完整参考 index.html 风格）**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>寻道 - 炼器坊</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=Noto+Serif+SC:wght@300;400;500&display=swap" rel="stylesheet">

    <style>
        /* 完全参考 index.html 的样式 */
        :root {
            --paper: #F4F2EC;
            --ink: #2A2927;
            --ink-light: #5A5855;
            --margin-height: 18vh;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body, html {
            width: 100%;
            height: 100%;
            background-color: var(--paper);
            color: var(--ink);
            font-family: 'Noto Serif SC', serif;
            overflow-x: hidden;
        }

        /* 布局结构完全参考 index.html */
        .viewport {
            position: relative;
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .margin-band {
            height: var(--margin-height);
            width: 100%;
            background-color: var(--paper);
            z-index: 10;
            position: relative;
        }

        .canvas-area {
            flex-grow: 1;
            width: 100%;
            position: relative;
            overflow: hidden;
        }

        #webgl-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            pointer-events: none;
        }

        .content-layer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 20;
            pointer-events: none;
        }

        .interactive {
            pointer-events: auto;
        }

        /* 导航 - 完全参考 index.html */
        .nav-links {
            position: absolute;
            top: 40vh;
            left: 15vw;
            display: flex;
            flex-direction: column;
            gap: 3rem;
        }

        .nav-item {
            text-decoration: none;
            color: var(--ink);
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            transition: opacity 0.6s ease;
        }

        .nav-links:hover .nav-item {
            opacity: 0.3;
        }

        .nav-links .nav-item:hover {
            opacity: 1;
        }

        .nav-cn {
            font-size: 1.2rem;
            letter-spacing: 0.3em;
            margin-bottom: 0.2rem;
            position: relative;
        }

        .nav-cn::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 0%;
            height: 1px;
            background-color: var(--ink);
            transition: width 0.6s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .nav-item:hover .nav-cn::after {
            width: 80%;
        }

        .nav-en {
            font-family: 'Cormorant Garamond', serif;
            font-size: 0.8rem;
            font-style: italic;
            letter-spacing: 0.1em;
            color: var(--ink-light);
        }

        /* 页面标题 - 竖排文字 */
        .page-title {
            position: absolute;
            top: calc(var(--margin-height) + 5vh);
            right: 12vw;
            writing-mode: vertical-rl;
            text-orientation: upright;
            font-size: 2.4rem;
            font-weight: 300;
            letter-spacing: 0.8em;
            line-height: 2;
            color: var(--ink);
        }

        /* 产品网格区域 */
        .products-section {
            position: absolute;
            top: calc(var(--margin-height) + 20vh);
            left: 50%;
            transform: translateX(-50%);
            width: 70%;
            max-width: 900px;
            pointer-events: auto;
        }

        .product-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 3rem;
        }

        /* 产品卡片 - 水墨风格 */
        .product-card {
            background: rgba(244, 242, 236, 0.9);
            border: 1px solid var(--ink-light);
            padding: 1.5rem;
            transition: all 0.4s ease;
        }

        .product-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 32px rgba(42, 41, 39, 0.15);
            border-color: var(--ink);
        }

        .product-image {
            width: 100%;
            aspect-ratio: 16/10;
            object-fit: cover;
            margin-bottom: 1rem;
            display: block;
        }

        .product-title {
            font-size: 1.1rem;
            letter-spacing: 0.2em;
            margin-bottom: 0.5rem;
            font-weight: 400;
        }

        .product-desc {
            font-size: 0.85rem;
            color: var(--ink-light);
            line-height: 1.8;
            margin-bottom: 1.2rem;
        }

        .product-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .like-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border: 1px solid var(--ink-light);
            background: transparent;
            color: var(--ink);
            font-family: 'Noto Serif SC', serif;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .like-btn:hover {
            border-color: var(--ink);
        }

        .like-btn.liked {
            background: var(--ink);
            color: var(--paper);
            border-color: var(--ink);
        }

        .link-btn {
            padding: 0.5rem 1.2rem;
            border: 1px solid var(--ink-light);
            color: var(--ink);
            font-size: 0.85rem;
            letter-spacing: 0.1em;
            transition: all 0.3s ease;
        }

        .link-btn:hover {
            background: var(--ink);
            color: var(--paper);
        }

        /* 底部标记 */
        .footer-mark {
            position: absolute;
            bottom: calc(var(--margin-height) / 2);
            left: 8vw;
            font-size: 0.8rem;
            letter-spacing: 0.2em;
            color: var(--ink-light);
        }

        /* 响应式 */
        @media (max-width: 1024px) {
            .nav-links { left: 10vw; }
            .page-title { right: 8vw; font-size: 2rem; }
            .products-section { width: 85%; }
            .product-grid { grid-template-columns: 1fr; gap: 2rem; }
        }
    </style>
</head>
<body>
    <div class="viewport">
        <!-- 上方留白 -->
        <div class="margin-band"></div>

        <!-- WebGL 背景 -->
        <div class="canvas-area">
            <div id="webgl-container"></div>
        </div>

        <!-- 下方留白 -->
        <div class="margin-band"></div>

        <!-- 内容层 -->
        <div class="content-layer">
            <!-- 导航 -->
            <nav class="nav-links interactive">
                <a href="index.html" class="nav-item">
                    <span class="nav-cn">首页</span>
                    <span class="nav-en">Home</span>
                </a>
                <a href="products.html" class="nav-item">
                    <span class="nav-cn">炼器坊</span>
                    <span class="nav-en">Artifacts</span>
                </a>
                <a href="admin.html" class="nav-item">
                    <span class="nav-cn">管理</span>
                    <span class="nav-en">Admin</span>
                </a>
            </nav>

            <!-- 页面标题 -->
            <h1 class="page-title">炼器坊</h1>

            <!-- 产品展示区域 -->
            <section class="products-section">
                <div class="product-grid" id="productGrid">
                    <!-- 产品卡片通过 JS 动态插入 -->
                </div>
            </section>

            <!-- 底部 -->
            <div class="footer-mark interactive">
                甲辰年 · 寻道
            </div>
        </div>
    </div>

    <!-- Three.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <!-- 共享脚本 -->
    <script src="js/app.js"></script>
    <script>
        // ==================== WebGL 背景 (完全复制 index.html 的 shader) ====================
        (function() {
            const container = document.getElementById('webgl-container');
            const scene = new THREE.Scene();
            const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });

            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(renderer.domElement);

            // 完全使用 index.html 的 shader 代码
            const vertexShader = `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `;

            const fragmentShader = `
                uniform float u_time;
                uniform vec2 u_resolution;
                varying vec2 vUv;

                vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

                float snoise(vec2 v){
                    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                            -0.577350269189626, 0.024390243902439);
                    vec2 i  = floor(v + dot(v, C.yy));
                    vec2 x0 = v - i + dot(i, C.xx);
                    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                    vec4 x12 = x0.xyxy + C.xxzz;
                    x12.xy -= i1;
                    i = mod(i, 289.0);
                    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
                    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                    m = m*m;
                    m = m*m;
                    vec3 x = 2.0 * fract(p * C.www) - 1.0;
                    vec3 h = abs(x) - 0.5;
                    vec3 ox = floor(x + 0.5);
                    vec3 a0 = x - ox;
                    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
                    vec3 g;
                    g.x = a0.x * x0.x + h.x * x0.y;
                    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                    return 130.0 * dot(m, g);
                }

                float fbm(vec2 st) {
                    float value = 0.0;
                    float amplitude = 0.5;
                    for (int i = 0; i < 5; i++) {
                        value += amplitude * snoise(st);
                        st *= 2.0;
                        amplitude *= 0.5;
                    }
                    return value;
                }

                void main() {
                    vec2 st = gl_FragCoord.xy / u_resolution.xy;
                    st.x *= u_resolution.x / u_resolution.y;
                    float time = u_time * 0.05;

                    vec2 q = vec2(0.);
                    q.x = fbm(st + vec2(time));
                    q.y = fbm(st + vec2(1.0));

                    vec2 r = vec2(0.);
                    r.x = fbm(st + 1.0*q + vec2(1.7,9.2)+ 0.15*time);
                    r.y = fbm(st + 1.0*q + vec2(8.3,2.8)+ 0.126*time);

                    float f = fbm(st + r);

                    vec3 colorPaper = vec3(0.82, 0.80, 0.77);
                    vec3 colorSlate = vec3(0.54, 0.55, 0.53);
                    vec3 colorUmber = vec3(0.42, 0.36, 0.32);
                    vec3 colorMist = vec3(0.64, 0.68, 0.67);
                    vec3 colorWhite = vec3(0.92, 0.92, 0.90);

                    vec3 color = mix(colorPaper, colorMist, clamp((f*f)*4.0, 0.0, 1.0));
                    color = mix(color, colorSlate, clamp(length(q), 0.0, 1.0));
                    color = mix(color, colorUmber, clamp(length(r.x), 0.0, 1.0) * 0.5);

                    float highlight = smoothstep(0.6, 1.0, f);
                    color = mix(color, colorWhite, highlight * 0.8);

                    gl_FragColor = vec4(color, 1.0);
                }
            `;

            const uniforms = {
                u_time: { value: 0.0 },
                u_resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) }
            };

            const material = new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader,
                uniforms
            });

            const geometry = new THREE.PlaneGeometry(2, 2);
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            const clock = new THREE.Clock();

            function animate() {
                requestAnimationFrame(animate);
                uniforms.u_time.value = clock.getElapsedTime();
                renderer.render(scene, camera);
            }

            animate();

            window.addEventListener('resize', () => {
                const width = container.clientWidth;
                const height = container.clientHeight;
                renderer.setSize(width, height);
                uniforms.u_resolution.value.set(width, height);
            });
        })();

        // ==================== 产品展示逻辑 ====================
        function renderProducts() {
            const products = getProducts();
            const grid = document.getElementById('productGrid');

            if (products.length === 0) {
                grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--ink-light);letter-spacing:0.2em;">暂无藏品</p>';
                return;
            }

            grid.innerHTML = products.map(product => {
                const likes = getProductLikes(product.id);
                const isLiked = hasLiked(product.id);
                // 默认水墨风格占位图
                const defaultImage = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect fill="#F4F2EC" width="400" height="250"/><text fill="#8A8B86" font-family="serif" font-size="18" x="50%" y="50%" text-anchor="middle" dy=".3em">暂未设置图片</text></svg>');

                return `
                    <div class="product-card">
                        <img src="${product.image || defaultImage}" alt="${product.title}" class="product-image" onerror="this.src='${defaultImage}'">
                        <h3 class="product-title">${product.title}</h3>
                        <p class="product-desc">${product.description}</p>
                        <div class="product-actions">
                            <button class="like-btn ${isLiked ? 'liked' : ''}" onclick="handleLike('${product.id}')">
                                <span>♥</span>
                                <span class="like-count">${likes}</span>
                            </button>
                            ${product.link ? `<a href="${product.link}" target="_blank" class="link-btn">查看详情</a>` : ''}
                        </div>
                    </div>
                `;
            }).join('');
        }

        function handleLike(productId) {
            if (hasLiked(productId)) {
                return; // 已点赞则不处理
            }
            const result = likeProduct(productId);
            if (result.success) {
                renderProducts();
            }
        }

        // 页面加载时渲染产品
        document.addEventListener('DOMContentLoaded', renderProducts);
    </script>
</body>
</html>
```

**Step 2: 验证文件创建**

Run: 检查文件是否存在
Expected: `products.html` 文件已创建

---

### Task 4: 创建管理员后台 (admin.html)

**Files:**
- Create: `admin.html`

**设计要求：** 完全参考 index.html 的水墨风格，包括：
- margin-band 上下留白布局
- 水墨风格 WebGL 背景
- 左侧导航
- 页面使用 .content-layer 浮在 WebGL 之上

**Step 1: 创建 HTML 文件（完整参考 index.html 风格）**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>寻道 - 管理后台</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=Noto+Serif+SC:wght@300;400;500&display=swap" rel="stylesheet">

    <style>
        /* 完全参考 index.html 的样式 */
        :root {
            --paper: #F4F2EC;
            --ink: #2A2927;
            --ink-light: #5A5855;
            --margin-height: 18vh;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body, html {
            width: 100%;
            height: 100%;
            background-color: var(--paper);
            color: var(--ink);
            font-family: 'Noto Serif SC', serif;
            overflow-x: hidden;
        }

        .viewport {
            position: relative;
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .margin-band {
            height: var(--margin-height);
            width: 100%;
            background-color: var(--paper);
            z-index: 10;
            position: relative;
        }

        .canvas-area {
            flex-grow: 1;
            width: 100%;
            position: relative;
            overflow: hidden;
        }

        #webgl-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            pointer-events: none;
        }

        .content-layer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 20;
            pointer-events: none;
        }

        .interactive {
            pointer-events: auto;
        }

        /* 导航 - 完全参考 index.html */
        .nav-links {
            position: absolute;
            top: 40vh;
            left: 15vw;
            display: flex;
            flex-direction: column;
            gap: 3rem;
        }

        .nav-item {
            text-decoration: none;
            color: var(--ink);
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            transition: opacity 0.6s ease;
        }

        .nav-links:hover .nav-item {
            opacity: 0.3;
        }

        .nav-links .nav-item:hover {
            opacity: 1;
        }

        .nav-cn {
            font-size: 1.2rem;
            letter-spacing: 0.3em;
            margin-bottom: 0.2rem;
            position: relative;
        }

        .nav-cn::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 0%;
            height: 1px;
            background-color: var(--ink);
            transition: width 0.6s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .nav-item:hover .nav-cn::after {
            width: 80%;
        }

        .nav-en {
            font-family: 'Cormorant Garamond', serif;
            font-size: 0.8rem;
            font-style: italic;
            letter-spacing: 0.1em;
            color: var(--ink-light);
        }

        /* 页面标题 - 竖排文字 */
        .page-title {
            position: absolute;
            top: calc(var(--margin-height) + 5vh);
            right: 12vw;
            writing-mode: vertical-rl;
            text-orientation: upright;
            font-size: 2.4rem;
            font-weight: 300;
            letter-spacing: 0.8em;
            line-height: 2;
            color: var(--ink);
        }

        /* 登录表单 */
        .login-section {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            max-width: 400px;
            padding: 2rem;
            pointer-events: auto;
        }

        .login-form {
            background: rgba(244, 242, 236, 0.95);
            padding: 3rem;
            border: 1px solid var(--ink-light);
        }

        .login-title {
            font-size: 1.3rem;
            letter-spacing: 0.3em;
            text-align: center;
            margin-bottom: 2rem;
            font-weight: 400;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-label {
            display: block;
            font-size: 0.9rem;
            letter-spacing: 0.1em;
            margin-bottom: 0.5rem;
        }

        .input {
            width: 100%;
            padding: 0.8rem 1rem;
            border: 1px solid var(--ink-light);
            background: var(--paper);
            color: var(--ink);
            font-family: 'Noto Serif SC', serif;
            font-size: 1rem;
        }

        .input:focus {
            outline: none;
            border-color: var(--ink);
        }

        textarea.input {
            min-height: 100px;
            resize: vertical;
        }

        .btn {
            padding: 0.8rem 2rem;
            border: 1px solid var(--ink);
            background: transparent;
            color: var(--ink);
            font-family: 'Noto Serif SC', serif;
            font-size: 0.9rem;
            letter-spacing: 0.2em;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn:hover {
            background: var(--ink);
            color: var(--paper);
        }

        .btn-primary {
            background: var(--ink);
            color: var(--paper);
        }

        .btn-primary:hover {
            background: var(--ink-light);
        }

        .error-msg {
            color: #8B0000;
            font-size: 0.85rem;
            margin-top: 0.5rem;
        }

        /* 管理面板 */
        .admin-section {
            position: absolute;
            top: calc(var(--margin-height) + 15vh);
            left: 50%;
            transform: translateX(-50%);
            width: 70%;
            max-width: 700px;
            pointer-events: auto;
        }

        .admin-panel {
            background: rgba(244, 242, 236, 0.95);
            padding: 2rem;
            border: 1px solid var(--ink-light);
            margin-bottom: 2rem;
        }

        .panel-title {
            font-size: 1.1rem;
            letter-spacing: 0.2em;
            margin-bottom: 1.5rem;
            font-weight: 400;
        }

        .form-actions {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
        }

        /* 产品列表 */
        .product-list {
            margin-top: 2rem;
        }

        .product-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            border: 1px solid var(--ink-light);
            margin-bottom: 0.8rem;
        }

        .product-item-title {
            font-size: 1rem;
            letter-spacing: 0.1em;
        }

        .product-item-desc {
            font-size: 0.8rem;
            color: var(--ink-light);
            margin-top: 0.3rem;
        }

        .delete-btn {
            padding: 0.5rem 1rem;
            border: 1px solid #8B0000;
            background: transparent;
            color: #8B0000;
            font-family: 'Noto Serif SC', serif;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .delete-btn:hover {
            background: #8B0000;
            color: var(--paper);
        }

        /* 底部标记 */
        .footer-mark {
            position: absolute;
            bottom: calc(var(--margin-height) / 2);
            left: 8vw;
            font-size: 0.8rem;
            letter-spacing: 0.2em;
            color: var(--ink-light);
        }

        /* 响应式 */
        @media (max-width: 1024px) {
            .nav-links { left: 10vw; }
            .page-title { right: 8vw; font-size: 2rem; }
            .admin-section { width: 85%; }
        }
    </style>
</head>
<body>
    <div class="viewport">
        <!-- 上方留白 -->
        <div class="margin-band"></div>

        <!-- WebGL 背景 -->
        <div class="canvas-area">
            <div id="webgl-container"></div>
        </div>

        <!-- 下方留白 -->
        <div class="margin-band"></div>

        <!-- 内容层 -->
        <div class="content-layer">
            <!-- 导航 -->
            <nav class="nav-links interactive">
                <a href="index.html" class="nav-item">
                    <span class="nav-cn">首页</span>
                    <span class="nav-en">Home</span>
                </a>
                <a href="products.html" class="nav-item">
                    <span class="nav-cn">炼器坊</span>
                    <span class="nav-en">Artifacts</span>
                </a>
                <a href="admin.html" class="nav-item">
                    <span class="nav-cn">管理</span>
                    <span class="nav-en">Admin</span>
                </a>
            </nav>

            <!-- 页面标题 -->
            <h1 class="page-title">洞府</h1>

            <!-- 登录表单 -->
            <section class="login-section" id="loginSection">
                <form class="login-form" onsubmit="return handleLogin(event)">
                    <h2 class="login-title">洞府密钥</h2>
                    <div class="form-group">
                        <input type="password" id="adminPassword" class="input" placeholder="请输入密钥" required>
                        <p class="error-msg" id="loginError"></p>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width:100%">进入</button>
                </form>
            </section>

            <!-- 管理面板 -->
            <section class="admin-section" id="adminSection" style="display:none;">
                <!-- 添加产品 -->
                <div class="admin-panel">
                    <h3 class="panel-title">铸器</h3>
                    <form onsubmit="return handleAddProduct(event)">
                        <div class="form-group">
                            <label class="form-label">名称</label>
                            <input type="text" id="productTitle" class="input" placeholder="请输入产品名称" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">描述</label>
                            <textarea id="productDesc" class="input" placeholder="请输入产品描述" required></textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">图片</label>
                            <input type="file" id="productImage" class="input" accept="image/*">
                            <input type="hidden" id="productImageBase64">
                        </div>
                        <div class="form-group">
                            <label class="form-label">链接</label>
                            <input type="url" id="productLink" class="input" placeholder="https://example.com">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">发布</button>
                            <button type="button" class="btn" onclick="handleLogout()">离去</button>
                        </div>
                    </form>
                </div>

                <!-- 产品列表 -->
                <div class="admin-panel">
                    <h3 class="panel-title">名录</h3>
                    <div id="productsContainer"></div>
                </div>
            </section>

            <!-- 底部 -->
            <div class="footer-mark interactive">
                甲辰年 · 寻道
            </div>
        </div>
    </div>

    <!-- Three.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <!-- 共享脚本 -->
    <script src="js/app.js"></script>
    <script>
        // ==================== WebGL 背景 (完全复制 index.html 的 shader) ====================
        (function() {
            const container = document.getElementById('webgl-container');
            const scene = new THREE.Scene();
            const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });

            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(renderer.domElement);

            const vertexShader = `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `;

            const fragmentShader = `
                uniform float u_time;
                uniform vec2 u_resolution;
                varying vec2 vUv;

                vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

                float snoise(vec2 v){
                    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                            -0.577350269189626, 0.024390243902439);
                    vec2 i  = floor(v + dot(v, C.yy));
                    vec2 x0 = v - i + dot(i, C.xx);
                    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                    vec4 x12 = x0.xyxy + C.xxzz;
                    x12.xy -= i1;
                    i = mod(i, 289.0);
                    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
                    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                    m = m*m;
                    m = m*m;
                    vec3 x = 2.0 * fract(p * C.www) - 1.0;
                    vec3 h = abs(x) - 0.5;
                    vec3 ox = floor(x + 0.5);
                    vec3 a0 = x - ox;
                    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
                    vec3 g;
                    g.x = a0.x * x0.x + h.x * x0.y;
                    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                    return 130.0 * dot(m, g);
                }

                float fbm(vec2 st) {
                    float value = 0.0;
                    float amplitude = 0.5;
                    for (int i = 0; i < 5; i++) {
                        value += amplitude * snoise(st);
                        st *= 2.0;
                        amplitude *= 0.5;
                    }
                    return value;
                }

                void main() {
                    vec2 st = gl_FragCoord.xy / u_resolution.xy;
                    st.x *= u_resolution.x / u_resolution.y;
                    float time = u_time * 0.05;

                    vec2 q = vec2(0.);
                    q.x = fbm(st + vec2(time));
                    q.y = fbm(st + vec2(1.0));

                    vec2 r = vec2(0.);
                    r.x = fbm(st + 1.0*q + vec2(1.7,9.2)+ 0.15*time);
                    r.y = fbm(st + 1.0*q + vec2(8.3,2.8)+ 0.126*time);

                    float f = fbm(st + r);

                    vec3 colorPaper = vec3(0.82, 0.80, 0.77);
                    vec3 colorSlate = vec3(0.54, 0.55, 0.53);
                    vec3 colorUmber = vec3(0.42, 0.36, 0.32);
                    vec3 colorMist = vec3(0.64, 0.68, 0.67);
                    vec3 colorWhite = vec3(0.92, 0.92, 0.90);

                    vec3 color = mix(colorPaper, colorMist, clamp((f*f)*4.0, 0.0, 1.0));
                    color = mix(color, colorSlate, clamp(length(q), 0.0, 1.0));
                    color = mix(color, colorUmber, clamp(length(r.x), 0.0, 1.0) * 0.5);

                    float highlight = smoothstep(0.6, 1.0, f);
                    color = mix(color, colorWhite, highlight * 0.8);

                    gl_FragColor = vec4(color, 1.0);
                }
            `;

            const uniforms = {
                u_time: { value: 0.0 },
                u_resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) }
            };

            const material = new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader,
                uniforms
            });

            const geometry = new THREE.PlaneGeometry(2, 2);
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            const clock = new THREE.Clock();

            function animate() {
                requestAnimationFrame(animate);
                uniforms.u_time.value = clock.getElapsedTime();
                renderer.render(scene, camera);
            }

            animate();

            window.addEventListener('resize', () => {
                const width = container.clientWidth;
                const height = container.clientHeight;
                renderer.setSize(width, height);
                uniforms.u_resolution.value.set(width, height);
            });
        })();

        // ==================== 管理后台逻辑 ====================

        // 页面加载时检查登录状态
        document.addEventListener('DOMContentLoaded', function() {
            if (isAdminLoggedIn()) {
                showAdminPanel();
            }
        });

        function handleLogin(event) {
            event.preventDefault();
            const password = document.getElementById('adminPassword').value;
            const errorEl = document.getElementById('loginError');

            const result = adminLogin(password);

            if (result.success) {
                showAdminPanel();
            } else {
                errorEl.textContent = result.message || '密钥错误';
            }

            return false;
        }

        function showAdminPanel() {
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('adminSection').style.display = 'block';
            renderProductList();
        }

        function handleLogout() {
            adminLogout();
            document.getElementById('loginSection').style.display = 'block';
            document.getElementById('adminSection').style.display = 'none';
            document.getElementById('adminPassword').value = '';
            document.getElementById('loginError').textContent = '';
        }

        // 图片处理
        document.getElementById('productImage').addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (file) {
                try {
                    const base64 = await imageToBase64(file);
                    document.getElementById('productImageBase64').value = base64;
                } catch (err) {
                    alert('图片处理失败');
                }
            }
        });

        function handleAddProduct(event) {
            event.preventDefault();

            const title = document.getElementById('productTitle').value;
            const description = document.getElementById('productDesc').value;
            const image = document.getElementById('productImageBase64').value;
            const link = document.getElementById('productLink').value;

            addProduct({
                title,
                description,
                image,
                link
            });

            // 重置表单
            event.target.reset();
            document.getElementById('productImageBase64').value = '';

            // 刷新列表
            renderProductList();

            alert('发布成功');

            return false;
        }

        function renderProductList() {
            const products = getProducts();
            const container = document.getElementById('productsContainer');

            if (products.length === 0) {
                container.innerHTML = '<p style="color:var(--ink-light);letter-spacing:0.1em;">暂未收录任何藏品</p>';
                return;
            }

            container.innerHTML = products.map(product => `
                <div class="product-item">
                    <div>
                        <div class="product-item-title">${product.title}</div>
                        <div class="product-item-desc">${product.description.substring(0, 40)}...</div>
                    </div>
                    <button class="delete-btn" onclick="handleDelete('${product.id}')">除名</button>
                </div>
            `).join('');
        }

        function handleDelete(id) {
            if (confirm('确定要删除此藏品吗？')) {
                deleteProduct(id);
                renderProductList();
            }
        }
    </script>
</body>
</html>
```

**Step 2: 验证文件创建**

Run: 检查文件是否存在
Expected: `admin.html` 文件已创建

---

### Task 5: 测试与验证

**Files:**
- Test: 手动测试

**Step 1: 打开 index.html 验证现有页面正常**
- 预期：水墨动效背景正常显示

**Step 2: 打开 products.html 验证产品展示页**
- 预期：显示示例产品卡片
- 预期：点赞按钮可点击
- 预期：跳转链接可点击

**Step 3: 打开 admin.html 验证管理后台**
- 预期：显示登录表单
- 预期：首次登录设置密码后可进入后台
- 预期：可以添加新产品
- 预期：添加后产品出现在 products.html

---

### Task 6: 提交代码

**Files:**
- 运行 git 命令提交

**Step 1: 初始化 git 并提交**

```bash
git init
git add .
git commit -m "feat: 添加产品展示网站功能

- 创建 products.html 产品展示页
- 创建 admin.html 管理员后台
- 创建 css/style.css 共享样式
- 创建 js/app.js 共享脚本
- 实现点赞功能（localStorage）
- 实现管理员密码登录"
```
