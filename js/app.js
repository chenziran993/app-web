/**
 * 寻道 (Xun Dao) - 共享脚本
 * 数字修真者录 - 产品管理、点赞、管理员功能
 */

const XUNDAO = (function() {
    'use strict';

    // ==================== 配置常量 ====================
    const CONFIG = {
        STORAGE_KEYS: {
            PRODUCTS: 'xundao_products',
            LIKES: 'xundao_likes',
            ADMIN_PASSWORD: 'xundao_admin_password',
            ADMIN_LOGGED_IN: 'xundao_admin_logged_in'
        },
        MIN_PASSWORD_LENGTH: 4
    };

    // ==================== 工具函数 ====================
    function generateId() {
        return Date.now().toString();
    }

    function getItem(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error(`Error reading ${key} from localStorage:`, e);
            return null;
        }
    }

    function setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error(`Error writing ${key} to localStorage:`, e);
            return false;
        }
    }

    // ==================== 产品管理模块 ====================
    const products = {
        getProducts: function() {
            const products = getItem(CONFIG.STORAGE_KEYS.PRODUCTS);
            return products || [];
        },

        saveProducts: function(products) {
            return setItem(CONFIG.STORAGE_KEYS.PRODUCTS, products);
        },

        addProduct: function(product) {
            const products = this.getProducts();
            const newProduct = {
                id: generateId(),
                title: product.title || '',
                description: product.description || '',
                image: product.image || '',
                link: product.link || '',
                likes: 0,
                createdAt: new Date().toISOString()
            };
            products.unshift(newProduct);
            this.saveProducts(products);
            return newProduct;
        },

        deleteProduct: function(id) {
            const products = this.getProducts();
            const filtered = products.filter(p => p.id !== id);
            this.saveProducts(filtered);
            return filtered;
        },

        getProduct: function(id) {
            const products = this.getProducts();
            return products.find(p => p.id === id) || null;
        },

        updateProduct: function(id, updates) {
            const products = this.getProducts();
            const index = products.findIndex(p => p.id === id);
            if (index !== -1) {
                products[index] = { ...products[index], ...updates };
                this.saveProducts(products);
                return products[index];
            }
            return null;
        }
    };

    // ==================== 点赞功能模块 ====================
    const likes = {
        getLikes: function() {
            const likes = getItem(CONFIG.STORAGE_KEYS.LIKES);
            return likes || {};
        },

        saveLikes: function(likes) {
            return setItem(CONFIG.STORAGE_KEYS.LIKES, likes);
        },

        getProductLikes: function(productId) {
            const allLikes = this.getLikes();
            return allLikes[productId] || 0;
        },

        likeProduct: function(productId) {
            const allLikes = this.getLikes();
            const likedProducts = this.getLikedProducts();

            // 检查是否已点赞
            if (likedProducts.includes(productId)) {
                return { success: false, message: 'Already liked' };
            }

            // 增加点赞数
            allLikes[productId] = (allLikes[productId] || 0) + 1;
            this.saveLikes(allLikes);

            // 记录已点赞产品
            likedProducts.push(productId);
            localStorage.setItem('xundao_liked_products', JSON.stringify(likedProducts));

            // 更新产品列表中的点赞数
            const product = products.getProduct(productId);
            if (product) {
                products.updateProduct(productId, { likes: allLikes[productId] });
            }

            return { success: true, likes: allLikes[productId] };
        },

        getLikedProducts: function() {
            try {
                const liked = localStorage.getItem('xundao_liked_products');
                return liked ? JSON.parse(liked) : [];
            } catch (e) {
                return [];
            }
        },

        hasLiked: function(productId) {
            const likedProducts = this.getLikedProducts();
            return likedProducts.includes(productId);
        }
    };

    // ==================== 管理员功能模块 ====================
    const admin = {
        hasPassword: function() {
            const password = localStorage.getItem(CONFIG.STORAGE_KEYS.ADMIN_PASSWORD);
            return password !== null && password.length >= CONFIG.MIN_PASSWORD_LENGTH;
        },

        setPassword: function(password) {
            if (!password || password.length < CONFIG.MIN_PASSWORD_LENGTH) {
                return { success: false, message: `Password must be at least ${CONFIG.MIN_PASSWORD_LENGTH} characters` };
            }
            localStorage.setItem(CONFIG.STORAGE_KEYS.ADMIN_PASSWORD, password);
            return { success: true, message: 'Password set successfully' };
        },

        verifyPassword: function(password) {
            const storedPassword = localStorage.getItem(CONFIG.STORAGE_KEYS.ADMIN_PASSWORD);
            return password === storedPassword;
        },

        adminLogin: function(password) {
            if (!this.verifyPassword(password)) {
                return { success: false, message: 'Invalid password' };
            }
            localStorage.setItem(CONFIG.STORAGE_KEYS.ADMIN_LOGGED_IN, 'true');
            return { success: true, message: 'Login successful' };
        },

        isAdminLoggedIn: function() {
            return localStorage.getItem(CONFIG.STORAGE_KEYS.ADMIN_LOGGED_IN) === 'true';
        },

        adminLogout: function() {
            localStorage.removeItem(CONFIG.STORAGE_KEYS.ADMIN_LOGGED_IN);
            return { success: true, message: 'Logged out successfully' };
        }
    };

    // ==================== 图片处理 ====================
    const imageUtils = {
        imageToBase64: function(file) {
            return new Promise(function(resolve, reject) {
                if (!file) {
                    reject(new Error('No file provided'));
                    return;
                }

                // 验证文件类型
                const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                if (!validTypes.includes(file.type)) {
                    reject(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
                    return;
                }

                // 验证文件大小 (最大 5MB)
                const maxSize = 5 * 1024 * 1024;
                if (file.size > maxSize) {
                    reject(new Error('File too large. Maximum size is 5MB.'));
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(e) {
                    resolve(e.target.result);
                };
                reader.onerror = function(e) {
                    reject(new Error('Failed to read file'));
                };
                reader.readAsDataURL(file);
            });
        }
    };

    // ==================== 初始化示例数据 ====================
    function initSampleData() {
        const existingProducts = products.getProducts();

        // 如果已有数据，则不初始化
        if (existingProducts.length > 0) {
            return false;
        }

        // 创建示例产品
        const sampleProducts = [
            {
                title: '寻道日志',
                description: '记录修行路上的点点滴滴',
                image: '',
                link: 'https://example.com/blog',
                likes: 0
            },
            {
                title: '作品集',
                description: '历年创作作品展示',
                image: '',
                link: 'https://example.com/portfolio',
                likes: 0
            }
        ];

        sampleProducts.forEach(function(product) {
            products.addProduct(product);
        });

        return true;
    }

    // ==================== 公开 API ====================
    return {
        CONFIG: CONFIG,
        products: products,
        likes: likes,
        admin: admin,
        imageUtils: imageUtils,
        initSampleData: initSampleData
    };
})();

// 自动初始化示例数据
if (typeof window !== 'undefined') {
    XUNDAO.initSampleData();
}
