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
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
