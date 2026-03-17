// server/local-dev.js
// 本地开发服务器 - 同时提供静态文件和 API
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 数据文件路径
const DATA_DIR = path.join(__dirname, 'data');
const productsFile = path.join(DATA_DIR, 'products.json');
const likesFile = path.join(DATA_DIR, 'likes.json');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// 初始化数据文件
function initDataFile(filePath, defaultData) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
}

function readData(filePath, defaultData = []) {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return defaultData;
    }
}

function writeData(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

initDataFile(productsFile, []);
initDataFile(likesFile, {});

// ============ API 接口 ============

// 获取产品列表
app.get('/api/products', (req, res) => {
    const products = readData(productsFile);
    const likes = readData(likesFile, {});
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

// 获取点赞
app.get('/api/likes', (req, res) => {
    const likes = readData(likesFile, {});
    res.json(likes);
});

// 点赞
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

// 静态文件服务（前端页面）
app.use(express.static(path.join(__dirname, '..')));

app.listen(PORT, () => {
    console.log(`本地开发服务器已启动：http://localhost:${PORT}`);
    console.log(`- 前端页面：http://localhost:${PORT}/index.html`);
    console.log(`- 产品页面：http://localhost:${PORT}/products.html`);
    console.log(`- 管理后台：http://localhost:${PORT}/admin.html`);
});
