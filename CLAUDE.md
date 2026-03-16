# 项目文档

## 项目概述

- **项目名称**: 寻道 (Xun Dao)
- **副标题**: Chronicles of a Digital Cultivator (数字修真者录)
- **作者**: 孤云 (Gu Yun)
- **类型**: 个人独立网站
- **技术栈**: 纯 HTML + Three.js (WebGL)

## 设计风格

- 传统中式美学
- 竖排文字布局
- 水墨风格 WebGL 动画背景
- 配色: 宣纸色 (#F4F2EC), 墨色 (#2A2927)
- 字体: Noto Serif SC, Cormorant Garamond

## 待开发

- 欢迎页 + 产品展示页
- 管理员后台

---

## 头脑风暴记录 (2026-03-16)

### Q1: 你希望接下来开发什么？

**用户回复:** 希望按照现有页面设计风格，创建两个页面：
- 第一页：欢迎页（参考HTML水墨动效风格）
- 第二页：产品展示页（可上传图片、有跳转链接、有点赞功能）

### Q2: 关于产品展示页的功能澄清

1. **图片上传** — 只有你自己能上传（管理员后台）
2. **点赞功能** — 任何人可点赞
3. **数据存储** — 需要后端数据库

**用户回复:** 只有我自己能上传，B，B

### Q3: 技术栈选择

1. **方案A: 全栈方案** — Node.js + Express + 前端页面
2. **方案B: 轻量方案** — 静态页面 + Supabase/Firebase
3. **方案C: 纯前端方案** — 静态页面 + localStorage

**用户回复:** 方案C（纯前端 + localStorage）

### Q4: 管理员功能确认

**用户回复:** 需要一个发布新产品的入口

### Q5: 管理员后台设计

1. **管理员后台**: 单独的页面（如 `/admin`），需要密码访问
2. **产品管理**: 后台上传产品，保存到 localStorage 或导出 JSON
3. **图片处理**: 通过 Base64 存储或选择图片后复制到 images/ 目录
4. **点赞数据**: 存储在 localStorage

**用户回复:** 可以

---

## 需求总结

**页面结构:**
- 欢迎页：参考现有HTML水墨动效风格
- 产品展示页：产品卡片展示、跳转链接、点赞按钮
- 管理员后台 (/admin)：密码登录、发布新产品

**功能:**
- 任何人可以浏览产品、点赞、点击跳转链接
- 管理员可以登录后台发布/管理产品
- 数据存储: localStorage

**技术栈:** 纯前端 HTML + CSS + JavaScript

---

## 方案设计

### 方案A: 单页面应用 (SPA) 方式
- 所有功能在一个 HTML 文件中
- 通过 JavaScript 控制页面切换
- 优点: 简单、一个文件管理
- 缺点: 代码可能较长

### 方案B: 多页面方式
- index.html (欢迎页)
- products.html (产品页)
- admin.html (管理员后台)
- 优点: 每个页面独立、易于维护
- 缺点: 需要多个文件

### 方案C: 框架方式
- 使用轻量框架如 Vue CDN 或 Alpine.js
- 优点: 更清晰的代码结构、数据绑定方便
- 缺点: 需要学习额外语法

---

**推荐方案:** 方案B (多页面方式)
- 与现有 index.html 风格一致
- 每个页面独立，便于维护
- 共享 CSS 和 JS 资源

**用户选择:** 方案B (多页面方式) ✓

---

## 确认的设计方案

**文件结构:**
```
├── index.html          # 欢迎页 (现有)
├── products.html      # 产品展示页 (新建)
├── admin.html         # 管理员后台 (新建)
├── css/
│   └── style.css     # 共享样式
├── js/
│   └── app.js        # 共享脚本
└── images/           # 产品图片目录
```

**用户确认:** 可以 ✓

---

## 页面设计规范 (参考现有 index.html)

### 布局结构
- 使用 `.viewport` 全屏布局
- 上下留白 `.margin-band` (height: 18vh)
- WebGL 背景在 `.canvas-area` 层
- 内容在 `.content-layer` 层 (z-index: 20)
- `pointer-events: none` 用于非交互元素
- `pointer-events: auto` 用于交互元素

### 配色方案
```css
:root {
    --paper: #F4F2EC;    /* 宣纸色 */
    --ink: #2A2927;      /* 墨色 */
    --ink-light: #5A5855; /* 浅墨色 */
    --margin-height: 18vh;
}
```

### 字体
- 中文: 'Noto Serif SC', serif
- 英文: 'Cormorant Garamond', serif

### 导航组件
- 左侧固定位置
- 中文 + 斜体英文组合
- hover 时下划线动画 (width 0% -> 80%)
- 过渡动画: 0.6s cubic-bezier(0.19, 1, 0.22, 1)

### 竖排文字
```css
writing-mode: vertical-rl;
text-orientation: upright;
letter-spacing: 0.8em;
```

### WebGL Shader
- 水墨风格动画
- Simplex noise + FBM 算法
- 配色: 宣纸、墨灰、暖褐、雾白、莲花白

---

## 页面设计

**用户确认:** 可以 ✓

---

## 正式设计文档

### 1. 产品展示页 (products.html)

**页面结构:**
- 顶部导航栏（水墨风格，与首页一致）
- 产品卡片网格展示区
- 底部返回入口

**产品卡片包含:**
- 产品图片（点击可查看大图）
- 产品标题
- 产品描述
- 点赞按钮（显示点赞数）
- 跳转链接按钮

**交互功能:**
- 点击点赞：点赞数+1，本地存储记录
- 点击跳转链接：在新窗口打开产品链接
- 点击图片：放大预览

### 2. 管理员后台 (admin.html)

**登录页:**
- 管理员密码输入框
- 登录按钮
- 错误提示

**管理面板（登录后）:**
- 产品列表（显示已发布产品）
- 添加新产品表单：
  - 产品标题（必填）
  - 产品描述（必填）
  - 产品图片（Base64 编码存储）
  - 跳转链接 URL（可选）
- 提交按钮
- 退出登录按钮

**数据存储:**
- 产品数据: localStorage `products` 键
- 点赞数据: localStorage `likes` 键
- 管理员密码: localStorage `admin_password` 键（首次需设置）

### 3. 共享样式 (css/style.css)

**配色方案:**
- 主色: 宣纸色 #F4F2EC
- 文字色: 墨色 #2A2927
- 浅色: #5A5855
- 强调色: #8A8B86

**字体:**
- 中文: Noto Serif SC
- 英文: Cormorant Garamond

**组件样式:**
- 按钮（水墨风格）
- 输入框
- 卡片
- 导航栏

### 4. 共享脚本 (js/app.js)

**产品管理模块:**
- `getProducts()`: 获取产品列表
- `addProduct(product)`: 添加产品
- `deleteProduct(id)`: 删除产品

**点赞模块:**
- `getLikes(productId)`: 获取点赞数
- `addLike(productId)`: 点赞（+1）
- `hasLiked(productId)`: 检查是否已点赞

**管理员模块:**
- `checkAdmin()`: 检查是否已登录
- `login(password)`: 登录验证
- `logout()`: 退出登录
- `setPassword(password)`: 首次设置密码

---

## 实现计划

下一步：调用 writing-plans skill 创建详细实现步骤
