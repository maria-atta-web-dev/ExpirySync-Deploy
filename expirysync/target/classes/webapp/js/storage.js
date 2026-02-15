// frontend/js/storage.js
class ExpirySyncStorage {
    constructor() {
        this.STORAGE_KEY = 'expirysync_inventory';
        this.DSA_LOG_KEY = 'dsa_operations_log';
        this.USER_KEY = 'expirysync_user';
        this.initDefaultData();

    }

    initDefaultData() {
        // Initialize with sample data if empty
        if (!this.getProducts().length) {
            const defaultProducts = [
                {
                    id: '1',
                    productName: 'Fresh Milk',
                    category: 'Dairy',
                    quantity: 25,
                    expiryDate: this.getDateString(2),
                    status: 'Expiring Soon',
                    supplier: 'Dairy Corp',
                    priority: 1,
                    addedDate: this.getDateString(-1),
                    price: 2.99
                },
                {
                    id: '2',
                    productName: 'Organic Eggs',
                    category: 'Dairy',
                    quantity: 12,
                    expiryDate: this.getDateString(30),
                    status: 'Healthy',
                    supplier: 'Farm Fresh',
                    priority: 3,
                    addedDate: this.getDateString(-5),
                    price: 4.50
                },
                {
                    id: '3',
                    productName: 'Whole Wheat Bread',
                    category: 'Bakery',
                    quantity: 8,
                    expiryDate: this.getDateString(-1),
                    status: 'Expired',
                    supplier: 'Bakery Inc',
                    priority: 0,
                    addedDate: this.getDateString(-10),
                    price: 3.25
                },
                {
                    id: '4',
                    productName: 'Greek Yogurt',
                    category: 'Dairy',
                    quantity: 15,
                    expiryDate: this.getDateString(5),
                    status: 'Expiring Soon',
                    supplier: 'Yogurt Co',
                    priority: 2,
                    addedDate: this.getDateString(-2),
                    price: 1.99
                },
                {
                    id: '5',
                    productName: 'Orange Juice',
                    category: 'Beverages',
                    quantity: 20,
                    expiryDate: this.getDateString(45),
                    status: 'Healthy',
                    supplier: 'Juice Factory',
                    priority: 4,
                    addedDate: this.getDateString(-3),
                    price: 3.75
                }
            ];
            this.saveProducts(defaultProducts);
        }

        // Initialize user if not exists
        if (!localStorage.getItem(this.USER_KEY)) {
            localStorage.setItem(this.USER_KEY, JSON.stringify({
                name: 'Store Manager',
                email: 'manager@expirysync.com',
                role: 'admin',
                storeName: 'Main Store'
            }));
        }
    }

    getDateString(daysFromNow) {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        return date.toISOString().split('T')[0];
    }

    // Product CRUD operations
    getProducts() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    }

    saveProducts(products) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
        return products;
    }

    getProduct(id) {
        return this.getProducts().find(p => p.id === id);
    }

    addProduct(productData) {
        const products = this.getProducts();
        const newProduct = {
            ...productData,
            id: 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            status: this.calculateStatus(productData.expiryDate),
            priority: this.calculatePriority(productData.expiryDate),
            addedDate: new Date().toISOString().split('T')[0]
        };

        products.push(newProduct);
        this.saveProducts(products);

        // Log DSA operation
        this.logDSAOperation('STACK', 'PUSH',
            `Added "${newProduct.productName}" to inventory stack`);

        return newProduct;
    }

    updateProduct(id, updates) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id === id);

        if (index !== -1) {
            const updatedProduct = {
                ...products[index],
                ...updates,
                status: updates.expiryDate ? this.calculateStatus(updates.expiryDate) : products[index].status,
                priority: updates.expiryDate ? this.calculatePriority(updates.expiryDate) : products[index].priority
            };

            products[index] = updatedProduct;
            this.saveProducts(products);

            this.logDSAOperation('ARRAY', 'UPDATE',
                `Updated product "${updatedProduct.productName}" in array`);

            return updatedProduct;
        }
        return null;
    }

    deleteProduct(id) {
        const products = this.getProducts();
        const productToDelete = products.find(p => p.id === id);
        const filteredProducts = products.filter(p => p.id !== id);
        this.saveProducts(filteredProducts);

        if (productToDelete) {
            this.logDSAOperation('QUEUE', 'DEQUEUE',
                `Removed "${productToDelete.productName}" from inventory queue`);
        }

        return true;
    }

    // DSA-based operations
    getExpiringSoon(limit = 7) {
        const products = this.getProducts();
        const today = new Date();
        const targetDate = new Date(today.getTime() + limit * 24 * 60 * 60 * 1000);

        return products
            .filter(p => {
                const expiry = new Date(p.expiryDate);
                return expiry > today && expiry <= targetDate;
            })
            .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
    }

    getLowStockProducts(threshold = 10) {
        return this.getProducts()
            .filter(p => p.quantity < threshold)
            .sort((a, b) => a.quantity - b.quantity);
    }

    getMostUrgentProduct() {
        const products = this.getProducts();
        if (!products.length) return null;

        // Priority queue simulation - find product with lowest priority number
        const urgent = products.reduce((min, p) =>
            p.priority < min.priority ? p : min, products[0]);

        this.logDSAOperation('PRIORITY QUEUE', 'PEEK',
            `Found most urgent: ${urgent.productName} (Priority: ${urgent.priority})`);

        return urgent;
    }

    getRecentAdditions(limit = 5) {
        return [...this.getProducts()]
            .sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
            .slice(0, limit);
    }

    // DSA operation logging
    logDSAOperation(structure, operation, description) {
        const log = this.getDSALog();
        const entry = {
            id: 'log_' + Date.now(),
            timestamp: new Date().toISOString(),
            structure,
            operation,
            description,
            frontendAction: this.getCurrentAction(),
            details: {
                page: window.location.pathname.split('/').pop(),
                productsCount: this.getProducts().length
            }
        };

        log.unshift(entry);
        if (log.length > 100) log.pop();

        localStorage.setItem(this.DSA_LOG_KEY, JSON.stringify(log));

        // Dispatch event for real-time updates
        window.dispatchEvent(new CustomEvent('dsa-operation', { detail: entry }));

        return entry;
    }

    getDSALog(limit = 50) {
        const log = JSON.parse(localStorage.getItem(this.DSA_LOG_KEY)) || [];
        return limit ? log.slice(0, limit) : log;
    }

    // Add these methods to the ExpirySyncStorage class in storage.js:

    // Add after the getDSALog() method
    getRecentActivities(limit = 10) {
        const products = this.getProducts();
        const logs = this.getDSALog();
        const activities = [];

        // Convert DSA logs to activities
        logs.slice(0, limit).forEach(log => {
            activities.push({
                type: this.getActivityTypeFromLog(log),
                title: `${log.structure} - ${log.operation}`,
                details: log.description,
                timestamp: log.timestamp,
                priority: log.structure === 'PRIORITY QUEUE' ? 1 : 2
            });
        });

        // Add product activities
        const recentProducts = this.getRecentAdditions(Math.min(limit, 3));
        recentProducts.forEach(product => {
            activities.push({
                type: 'add',
                title: 'Product Added',
                details: `Added ${product.productName} (${product.category})`,
                timestamp: product.addedDate,
                priority: 3
            });
        });

        // Sort by timestamp and limit
        return activities
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    }

    getActivityTypeFromLog(log) {
        if (log.structure === 'STACK') return 'stack';
        if (log.structure === 'QUEUE') return 'queue';
        if (log.structure === 'PRIORITY QUEUE') return 'priority';
        if (log.operation.includes('SORT')) return 'sort';
        if (log.operation.includes('ADD') || log.operation.includes('PUSH')) return 'add';
        if (log.operation.includes('DELETE') || log.operation.includes('POP')) return 'delete';
        if (log.operation.includes('UPDATE')) return 'update';
        if (log.operation.includes('SEARCH')) return 'search';
        return 'default';
    }

    // Add a method to trigger dashboard refresh
    notifyDashboardRefresh() {
        // Store last update timestamp
        localStorage.setItem('dashboard_last_refresh', Date.now().toString());

        // Dispatch event for real-time updates
        window.dispatchEvent(new CustomEvent('dashboard-refresh'));
    }
    // Add this method in storage.js
    notifyDashboardRefresh() {
        // Store last update timestamp
        localStorage.setItem('dashboard_last_refresh', Date.now().toString());

        // Dispatch event for real-time updates
        window.dispatchEvent(new CustomEvent('dashboard-refresh', {
            detail: {
                timestamp: new Date().toISOString(),
                source: 'add_product'
            }
        }));

        // Also trigger storage event for cross-tab communication
        const event = new StorageEvent('storage', {
            key: 'expirysync_inventory',
            newValue: JSON.stringify(this.getProducts()),
            oldValue: JSON.stringify(this.getProducts()),
            storageArea: localStorage
        });
        window.dispatchEvent(event);
    }
    // Add method to check if dashboard needs refresh
    shouldRefreshDashboard() {
        const lastRefresh = localStorage.getItem('dashboard_last_refresh');
        if (!lastRefresh) return true;

        const timeSinceRefresh = Date.now() - parseInt(lastRefresh);
        return timeSinceRefresh > 5000; // Refresh if older than 5 seconds
    }

    clearDSALog() {
        localStorage.setItem(this.DSA_LOG_KEY, JSON.stringify([]));
    }

    getCurrentAction() {
        const path = window.location.pathname;
        if (path.includes('add-product')) return 'ADD_PRODUCT';
        if (path.includes('inventory')) return 'MANAGE_INVENTORY';
        if (path.includes('dashboard')) return 'VIEW_DASHBOARD';
        if (path.includes('alerts')) return 'VIEW_ALERTS';
        if (path.includes('dsa-demo')) return 'DSA_DEMO';
        return 'OTHER_ACTION';
    }

    // Helper methods
    calculateStatus(expiryDate) {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const daysDiff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

        if (daysDiff < 0) return 'Expired';
        if (daysDiff <= 7) return 'Expiring Soon';
        return 'Healthy';
    }

    calculatePriority(expiryDate) {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const daysDiff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

        if (daysDiff < 0) return 0; // Expired
        if (daysDiff <= 3) return 1; // Urgent
        if (daysDiff <= 7) return 2; // Soon
        if (daysDiff <= 15) return 3; // Warning
        return 4; // Healthy
    }

    // Statistics
    getStats() {
        const products = this.getProducts();
        const today = new Date();

        const stats = {
            total: products.length,
            lowStock: products.filter(p => p.quantity < 10).length,
            expiringSoon: this.getExpiringSoon(7).length,
            expired: products.filter(p => new Date(p.expiryDate) < today).length,
            categories: this.getCategoryDistribution(),
            totalValue: this.calculateTotalValue()
        };

        return stats;
    }

    getCategoryDistribution() {
        const products = this.getProducts();
        const distribution = {};

        products.forEach(p => {
            const category = p.category || 'Uncategorized';
            distribution[category] = (distribution[category] || 0) + 1;
        });

        return distribution;
    }

    calculateTotalValue() {
        return this.getProducts()
            .reduce((sum, p) => sum + (p.quantity * (p.price || 0)), 0)
            .toFixed(2);
    }

    // Search and filter
    searchProducts(query) {
        const products = this.getProducts();
        const searchTerm = query.toLowerCase();

        return products.filter(p =>
            p.productName.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm) ||
            p.id.toLowerCase().includes(searchTerm) ||
            p.supplier.toLowerCase().includes(searchTerm)
        );
    }

    filterProducts(filters) {
        let products = this.getProducts();

        if (filters.category) {
            products = products.filter(p => p.category === filters.category);
        }

        if (filters.status) {
            products = products.filter(p => p.status === filters.status);
        }

        if (filters.minQuantity !== undefined) {
            products = products.filter(p => p.quantity >= filters.minQuantity);
        }

        if (filters.maxQuantity !== undefined) {
            products = products.filter(p => p.quantity <= filters.maxQuantity);
        }

        if (filters.startDate) {
            products = products.filter(p => new Date(p.expiryDate) >= new Date(filters.startDate));
        }

        if (filters.endDate) {
            products = products.filter(p => new Date(p.expiryDate) <= new Date(filters.endDate));
        }

        return products;
    }

    // User management
    getUser() {
        return JSON.parse(localStorage.getItem(this.USER_KEY));
    }

    updateUser(updates) {
        const user = this.getUser();
        const updatedUser = { ...user, ...updates };
        localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
        return updatedUser;
    }

    // Export/Import
    exportData() {
        const data = {
            products: this.getProducts(),
            user: this.getUser(),
            dsaLog: this.getDSALog(),
            exportDate: new Date().toISOString()
        };

        return JSON.stringify(data, null, 2);
    }

    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);

            if (data.products) {
                this.saveProducts(data.products);
            }

            if (data.user) {
                localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
            }

            this.logDSAOperation('DATA STRUCTURE', 'IMPORT',
                `Imported ${data.products?.length || 0} products`);

            return true;
        } catch (error) {
            console.error('Import failed:', error);
            return false;
        }
    }

    // Backup and restore
    createBackup() {
        return {
            timestamp: new Date().toISOString(),
            data: this.exportData(),
            version: '1.0'
        };
    }

    restoreBackup(backup) {
        return this.importData(backup.data);
    }
}

// Global storage instance
const storage = new ExpirySyncStorage();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ExpirySyncStorage, storage };
}