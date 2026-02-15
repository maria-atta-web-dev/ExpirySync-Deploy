// frontend/js/dashboard.js
class DashboardManager {
    constructor() {
        this.storage = storage;
        this.simulator = dsaSimulator;
        this.charts = {};
        this.init();
    }
    
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.loadDashboardData();
            this.setupEventListeners();
            this.updateDSAStats();
            
            // Auto-refresh every 30 seconds
            setInterval(() => {
                this.loadDashboardData();
                this.updateDSAStats();
            }, 30000);
        });
    }
    
    loadDashboardData() {
        try {
            const stats = this.storage.getStats();
            const products = this.storage.getProducts();
            const urgentProduct = this.storage.getMostUrgentProduct();
            const recentAdditions = this.storage.getRecentAdditions(5);
            const expiringSoon = this.storage.getExpiringSoon(7);
            
            // Update stats cards
            this.updateStats(stats);
            
            // Update urgent alerts
            this.updateUrgentAlerts(urgentProduct, expiringSoon);
            
            // Update recent activities
            this.updateRecentActivities(recentAdditions);
            
            // Update charts if they exist
            if (Object.keys(this.charts).length > 0) {
                this.updateCharts(products, stats);
            } else {
                // Initialize charts on first load
                this.initializeCharts(products, stats);
            }
            
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            this.showError('Failed to load dashboard data');
        }
    }
    
    updateStats(stats) {
        const elements = {
            'total-products': stats.total,
            'low-stock': stats.lowStock,
            'expiring-soon': stats.expiringSoon,
            'expired': stats.expired
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }
    
    updateUrgentAlerts(urgentProduct, expiringSoon) {
        const container = document.getElementById('urgent-alerts');
        if (!container) return;
        
        let html = '';
        
        // Add most urgent product alert
        if (urgentProduct) {
            const daysLeft = this.calculateDaysUntilExpiry(urgentProduct.expiryDate);
            const discount = this.getDiscountPercentage(daysLeft);
            
            html += `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle"></i>
                    <div class="alert-content">
                        <strong>${urgentProduct.productName}</strong> 
                        <span class="text-muted">• ${urgentProduct.category}</span>
                        <div class="alert-details">
                            Expires in ${Math.abs(daysLeft)} ${Math.abs(daysLeft) === 1 ? 'day' : 'days'} 
                            • Priority: ${urgentProduct.priority}
                        </div>
                    </div>
                    <button class="btn btn-sm btn-danger" 
                            onclick="dashboardManager.applyDiscount('${urgentProduct.id}')">
                        Apply ${discount}% Discount
                    </button>
                </div>
            `;
        }
        
        // Add expiring soon alerts
        expiringSoon.slice(0, 3).forEach(product => {
            const daysLeft = this.calculateDaysUntilExpiry(product.expiryDate);
            
            html += `
                <div class="alert alert-warning">
                    <i class="fas fa-clock"></i>
                    <div class="alert-content">
                        <strong>${product.productName}</strong> 
                        <span class="text-muted">• ${product.category}</span>
                        <div class="alert-details">
                            Expires in ${daysLeft} days • Stock: ${product.quantity}
                        </div>
                    </div>
                    <button class="btn btn-sm btn-warning" 
                            onclick="dashboardManager.notifyStaff('${product.id}')">
                        Notify Staff
                    </button>
                </div>
            `;
        });
        
        if (!html) {
            html = `
                <div class="empty-state">
                    <i class="fas fa-check-circle text-success"></i>
                    <p>No urgent alerts at this time</p>
                </div>
            `;
        }
        
        container.innerHTML = html;
    }
    
    updateRecentActivities(activities) {
        const container = document.getElementById('recent-activities');
        if (!container) return;
        
        if (!activities || activities.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-muted">
                        No recent activities
                    </td>
                </tr>
            `;
            return;
        }
        
        const html = activities.map(activity => `
            <tr>
                <td>
                    <strong>${activity.productName}</strong>
                    <div class="text-muted small">${activity.category}</div>
                </td>
                <td>
                    <span class="badge ${this.getStatusClass(activity.status)}">
                        ${activity.status}
                    </span>
                </td>
                <td>${new Date(activity.addedDate).toLocaleDateString()}</td>
                <td>${activity.quantity} units</td>
            </tr>
        `).join('');
        
        container.innerHTML = html;
    }
    
    initializeCharts(products, stats) {
        // Initialize Chart.js if available
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded');
            return;
        }
        
        // Category Distribution Chart
        const categoryCtx = document.getElementById('category-chart');
        if (categoryCtx) {
            const categoryData = this.prepareCategoryData(stats.categories);
            
            this.charts.category = new Chart(categoryCtx, {
                type: 'doughnut',
                data: {
                    labels: categoryData.labels,
                    datasets: [{
                        data: categoryData.values,
                        backgroundColor: [
                            '#0077C8', '#00A7A7', '#00C853', 
                            '#FF9800', '#9C27B0', '#E91E63'
                        ],
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true
                            }
                        }
                    }
                }
            });
        }
        
        // Inventory Trend Chart
        const trendCtx = document.getElementById('inventory-chart');
        if (trendCtx) {
            const trendData = this.prepareTrendData(products);
            
            this.charts.trend = new Chart(trendCtx, {
                type: 'line',
                data: {
                    labels: trendData.labels,
                    datasets: [{
                        label: 'Products Added',
                        data: trendData.values,
                        borderColor: '#0077C8',
                        backgroundColor: 'rgba(0, 119, 200, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                drawBorder: false
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }
    }
    
    updateCharts(products, stats) {
        if (this.charts.category) {
            const categoryData = this.prepareCategoryData(stats.categories);
            this.charts.category.data.labels = categoryData.labels;
            this.charts.category.data.datasets[0].data = categoryData.values;
            this.charts.category.update();
        }
        
        if (this.charts.trend) {
            const trendData = this.prepareTrendData(products);
            this.charts.trend.data.labels = trendData.labels;
            this.charts.trend.data.datasets[0].data = trendData.values;
            this.charts.trend.update();
        }
    }
    
    prepareCategoryData(categoryDistribution) {
        const labels = Object.keys(categoryDistribution);
        const values = Object.values(categoryDistribution);
        
        // Limit to top 5 categories, group rest as "Other"
        if (labels.length > 5) {
            const sorted = labels.map((label, index) => ({
                label,
                value: values[index]
            })).sort((a, b) => b.value - a.value);
            
            const top5 = sorted.slice(0, 5);
            const otherSum = sorted.slice(5).reduce((sum, item) => sum + item.value, 0);
            
            return {
                labels: [...top5.map(item => item.label), 'Other'],
                values: [...top5.map(item => item.value), otherSum]
            };
        }
        
        return { labels, values };
    }
    
    prepareTrendData(products) {
        // Generate last 7 days data
        const days = 7;
        const labels = [];
        const values = [];
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
            labels.push(dateStr);
            
            // Count products added on that day
            const count = products.filter(p => {
                const addedDate = new Date(p.addedDate);
                return addedDate.toDateString() === date.toDateString();
            }).length;
            
            values.push(count);
        }
        
        return { labels, values };
    }
    
    updateDSAStats() {
        const products = this.storage.getProducts();
        
        // Stack operations count
        const stackCount = Math.min(this.storage.getRecentAdditions().length, 10);
        document.getElementById('stack-count')?.textContent = stackCount;
        
        // Queue operations count
        const queueCount = this.storage.getExpiringSoon(30).length;
        document.getElementById('queue-count')?.textContent = queueCount;
        
        // Priority queue count
        const priorityCount = products.filter(p => p.priority <= 2).length;
        document.getElementById('priority-count')?.textContent = priorityCount;
        
        // Sorting operations count
        document.getElementById('sort-count')?.textContent = products.length;
    }
    
    setupEventListeners() {
        // Time filter for charts
        const timeFilter = document.getElementById('time-filter');
        if (timeFilter) {
            timeFilter.addEventListener('change', (e) => {
                this.handleTimeFilterChange(e.target.value);
            });
        }
        
        // Simulate DSA operations button
        const simulateBtn = document.getElementById('simulate-operations');
        if (simulateBtn) {
            simulateBtn.addEventListener('click', () => {
                this.simulator.simulateAllOperations();
                this.showSuccess('Simulating DSA operations...');
            });
        }
        
        // Refresh button
        const refreshBtn = document.getElementById('refresh-dashboard');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadDashboardData();
                this.showSuccess('Dashboard refreshed');
            });
        }
    }
    
    handleTimeFilterChange(period) {
        // Reload data based on selected period
        this.loadDashboardData();
        
        // Log DSA operation
        this.storage.logDSAOperation('ARRAY', 'FILTER', 
            `Filtered dashboard data for ${period} period`);
    }
    
    // Action methods
    applyDiscount(productId) {
        const product = this.storage.getProduct(productId);
        if (!product) return;
        
        const daysLeft = this.calculateDaysUntilExpiry(product.expiryDate);
        const discount = this.getDiscountPercentage(daysLeft);
        
        // Simulate backend discount application
        this.simulator.simulateOperation('QUEUE_DEQUEUE', product);
        
        this.showSuccess(`Applied ${discount}% discount to ${product.productName}`);
    }
    
    notifyStaff(productId) {
        const product = this.storage.getProduct(productId);
        if (!product) return;
        
        // Simulate notification system
        this.storage.logDSAOperation('QUEUE', 'NOTIFY',
            `Staff notified about ${product.productName} expiring soon`);
        
        this.showSuccess(`Staff notified about ${product.productName}`);
    }
    
    // Utility methods
    calculateDaysUntilExpiry(expiryDate) {
        const today = new Date();
        const expiry = new Date(expiryDate);
        return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    }
    
    getDiscountPercentage(daysLeft) {
        if (daysLeft < 0) return 50; // Expired
        if (daysLeft <= 3) return 40; // 1-3 days
        if (daysLeft <= 7) return 30; // 4-7 days
        if (daysLeft <= 14) return 20; // 8-14 days
        return 10; // 15+ days
    }
    
    getStatusClass(status) {
        switch (status) {
            case 'Healthy': return 'status-healthy';
            case 'Expiring Soon': return 'status-expiring';
            case 'Expired': return 'status-expired';
            default: return '';
        }
    }
    
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
            color: ${type === 'success' ? '#155724' : '#721c24'};
            padding: 15px 20px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        
        // Add close button handler
        notification.querySelector('.notification-close').onclick = () => {
            notification.remove();
        };
        
        // Add to document
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
}

// Global dashboard instance
const dashboardManager = new DashboardManager();

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        margin-left: 10px;
    }
    
    .notification-close:hover {
        background: rgba(0,0,0,0.1);
    }
`;
document.head.appendChild(notificationStyles);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DashboardManager, dashboardManager };
}