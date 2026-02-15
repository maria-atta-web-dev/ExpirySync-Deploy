// frontend/js/inventory.js
class InventoryManager {
    constructor() {
        this.storage = storage;
        this.simulator = dsaSimulator;
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.currentFilters = {};
        this.currentSort = { field: 'expiryDate', order: 'asc' };
        this.init();
    }
    
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.loadInventory();
            this.setupEventListeners();
            this.updateStorageInfo();
            
            // Update storage info every 30 seconds
            setInterval(() => this.updateStorageInfo(), 30000);
        });
    }
    
    async loadInventory() {
        try {
            const products = this.storage.getProducts();
            this.allProducts = products;
            this.applyFiltersAndRender();
        } catch (error) {
            console.error('Failed to load inventory:', error);
            this.showError('Failed to load inventory data');
        }
    }
    
    applyFiltersAndRender() {
        if (!this.allProducts) return;
        
        let filtered = [...this.allProducts];
        
        // Apply search filter
        if (this.currentFilters.search) {
            filtered = this.storage.searchProducts(this.currentFilters.search);
        }
        
        // Apply category filter
        if (this.currentFilters.category) {
            filtered = filtered.filter(p => p.category === this.currentFilters.category);
        }
        
        // Apply stock filter
        if (this.currentFilters.stock === 'low') {
            filtered = filtered.filter(p => p.quantity < 10);
        } else if (this.currentFilters.stock === 'healthy') {
            filtered = filtered.filter(p => p.quantity >= 10);
        }
        
        // Apply expiry filter
        if (this.currentFilters.expiry === 'expired') {
            filtered = filtered.filter(p => p.status === 'Expired');
        } else if (this.currentFilters.expiry === 'expiring') {
            filtered = filtered.filter(p => p.status === 'Expiring Soon');
        } else if (this.currentFilters.expiry === 'healthy') {
            filtered = filtered.filter(p => p.status === 'Healthy');
        }
        
        // Apply date range filter
        if (this.currentFilters.startDate) {
            filtered = filtered.filter(p => 
                new Date(p.expiryDate) >= new Date(this.currentFilters.startDate));
        }
        
        if (this.currentFilters.endDate) {
            filtered = filtered.filter(p => 
                new Date(p.expiryDate) <= new Date(this.currentFilters.endDate));
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            let aValue = a[this.currentSort.field];
            let bValue = b[this.currentSort.field];
            
            // Handle dates
            if (this.currentSort.field === 'expiryDate' || this.currentSort.field === 'addedDate') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }
            
            // Handle strings (case-insensitive)
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }
            
            if (aValue < bValue) return this.currentSort.order === 'asc' ? -1 : 1;
            if (aValue > bValue) return this.currentSort.order === 'asc' ? 1 : -1;
            return 0;
        });
        
        this.filteredProducts = filtered;
        this.renderTable();
        this.renderPagination();
        this.updateProductCount();
        this.populateCategoryFilter();
    }
    
    renderTable() {
        const tbody = document.getElementById('inventory-body');
        if (!tbody) return;
        
        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageProducts = this.filteredProducts.slice(startIndex, endIndex);
        
        if (pageProducts.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted py-5">
                        <i class="fas fa-inbox fa-3x mb-3"></i>
                        <p class="mb-1">No products found</p>
                        <small class="text-muted">Try adjusting your filters or add new products</small>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = pageProducts.map(product => this.renderProductRow(product)).join('');
    }
    
    renderProductRow(product) {
        const expiryDate = new Date(product.expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        
        // Determine status
        let statusClass, statusText;
        if (daysUntilExpiry < 0) {
            statusClass = 'status-expired';
            statusText = 'Expired';
        } else if (daysUntilExpiry <= 7) {
            statusClass = 'status-expiring';
            statusText = 'Expiring Soon';
        } else {
            statusClass = 'status-healthy';
            statusText = 'Healthy';
        }
        
        // Determine priority badge
        let priorityClass = '';
        if (product.priority <= 1) priorityClass = 'priority-high';
        else if (product.priority <= 2) priorityClass = 'priority-medium';
        else priorityClass = 'priority-low';
        
        return `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="priority-indicator ${priorityClass}"></div>
                        <div>
                            <strong>${product.id.substring(0, 8)}...</strong>
                            <div class="text-muted small">${product.category}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <strong>${product.productName}</strong>
                    ${product.supplier ? `<div class="text-muted small">${product.supplier}</div>` : ''}
                </td>
                <td>
                    <span class="badge ${statusClass}">${statusText}</span>
                    <div class="text-muted small">${daysUntilExpiry} days</div>
                </td>
                <td>
                    <div class="quantity-display">
                        ${product.quantity}
                        ${product.quantity < 10 ? '<i class="fas fa-exclamation-triangle text-warning ml-1"></i>' : ''}
                    </div>
                </td>
                <td>${new Date(product.expiryDate).toLocaleDateString()}</td>
                <td>$${(product.price || 0).toFixed(2)}</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="inventoryManager.editProduct('${product.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-info" onclick="inventoryManager.viewProduct('${product.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="inventoryManager.deleteProduct('${product.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }
    
    renderPagination() {
        const container = document.getElementById('pagination');
        if (!container) return;
        
        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }
        
        let html = '';
        
        // Previous button
        html += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="inventoryManager.goToPage(${this.currentPage - 1})">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `;
        
        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            html += `
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="inventoryManager.goToPage(${i})">${i}</a>
                </li>
            `;
        }
        
        // Next button
        html += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="inventoryManager.goToPage(${this.currentPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;
        
        container.innerHTML = html;
    }
    
    updateProductCount() {
        const countElement = document.getElementById('product-count');
        if (countElement) {
            countElement.textContent = `${this.filteredProducts.length} products`;
        }
    }
    
    populateCategoryFilter() {
        const filterElement = document.getElementById('filter-category');
        if (!filterElement) return;
        
        // Get unique categories
        const categories = [...new Set(this.allProducts.map(p => p.category).filter(Boolean))];
        
        // Clear existing options except "All Categories"
        while (filterElement.options.length > 1) {
            filterElement.remove(1);
        }
        
        // Add category options
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            filterElement.appendChild(option);
        });
    }
    
    updateStorageInfo() {
        const products = this.storage.getProducts();
        const dsaLog = this.storage.getDSALog();
        
        document.getElementById('local-count')?.textContent = products.length;
        document.getElementById('pending-count')?.textContent = dsaLog.length;
        
        // Update last updated time
        const lastUpdatedElement = document.getElementById('last-updated');
        if (lastUpdatedElement && dsaLog.length > 0) {
            const lastUpdate = new Date(dsaLog[0].timestamp);
            lastUpdatedElement.textContent = lastUpdate.toLocaleTimeString();
        }
    }
    
    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value.trim();
                this.currentPage = 1;
                this.applyFiltersAndRender();
                
                if (this.currentFilters.search) {
                    this.storage.logDSAOperation('ARRAY', 'SEARCH',
                        `Searched for "${this.currentFilters.search}" in inventory`);
                }
            });
        }
        
        // Category filter
        const categoryFilter = document.getElementById('filter-category');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value || null;
                this.currentPage = 1;
                this.applyFiltersAndRender();
            });
        }
        
        // Stock filter
        const stockFilter = document.getElementById('filter-stock');
        if (stockFilter) {
            stockFilter.addEventListener('change', (e) => {
                this.currentFilters.stock = e.target.value || null;
                this.currentPage = 1;
                this.applyFiltersAndRender();
            });
        }
        
        // Expiry filter
        const expiryFilter = document.getElementById('filter-expiry');
        if (expiryFilter) {
            expiryFilter.addEventListener('change', (e) => {
                this.currentFilters.expiry = e.target.value || null;
                this.currentPage = 1;
                this.applyFiltersAndRender();
            });
        }
        
        // Date range filters
        const startDateInput = document.getElementById('filter-start-date');
        const endDateInput = document.getElementById('filter-end-date');
        
        if (startDateInput) {
            startDateInput.addEventListener('change', (e) => {
                this.currentFilters.startDate = e.target.value || null;
                this.currentPage = 1;
                this.applyFiltersAndRender();
            });
        }
        
        if (endDateInput) {
            endDateInput.addEventListener('change', (e) => {
                this.currentFilters.endDate = e.target.value || null;
                this.currentPage = 1;
                this.applyFiltersAndRender();
            });
        }
        
        // Sort functionality
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-sort]')) {
                const sortField = e.target.closest('[data-sort]').dataset.sort;
                this.handleSort(sortField);
            }
        });
        
        // Export CSV button
        const exportBtn = document.getElementById('export-csv');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportToCSV());
        }
        
        // Import CSV button
        const importBtn = document.getElementById('import-csv');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.importFromCSV());
        }
        
        // Sync button
        const syncBtn = document.getElementById('sync-button');
        if (syncBtn) {
            syncBtn.addEventListener('click', () => this.simulateSync());
        }
    }
    
    handleSort(field) {
        if (this.currentSort.field === field) {
            // Toggle order
            this.currentSort.order = this.currentSort.order === 'asc' ? 'desc' : 'asc';
        } else {
            // New field, default to ascending
            this.currentSort.field = field;
            this.currentSort.order = 'asc';
        }
        
        this.applyFiltersAndRender();
        
        // Log DSA operation
        this.storage.logDSAOperation('ARRAY', 'SORT',
            `Sorted products by ${field} (${this.currentSort.order.toUpperCase()})`);
    }
    
    goToPage(page) {
        if (page < 1 || page > Math.ceil(this.filteredProducts.length / this.itemsPerPage)) {
            return;
        }
        
        this.currentPage = page;
        this.applyFiltersAndRender();
        
        // Scroll to top of table
        const table = document.querySelector('.table-responsive');
        if (table) {
            table.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Action methods
    editProduct(productId) {
        // Navigate to edit page or show modal
        const product = this.storage.getProduct(productId);
        if (product) {
            // Simulate backend update operation
            this.simulator.simulateOperation('ARRAY_UPDATE', product);
            
            // Show edit modal or navigate
            this.showEditModal(product);
        }
    }
    
    viewProduct(productId) {
        const product = this.storage.getProduct(productId);
        if (product) {
            this.showProductDetails(product);
        }
    }
    
    deleteProduct(productId) {
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }
        
        const product = this.storage.getProduct(productId);
        if (product) {
            // Simulate backend delete operation
            this.simulator.simulateOperation('STACK_POP', product);
            
            // Delete from storage
            this.storage.deleteProduct(productId);
            
            // Reload inventory
            this.loadInventory();
            
            this.showSuccess(`Deleted ${product.productName}`);
        }
    }
    
    exportToCSV() {
        const products = this.filteredProducts.length > 0 ? 
            this.filteredProducts : this.allProducts;
        
        if (products.length === 0) {
            this.showError('No products to export');
            return;
        }
        
        // Create CSV content
        const headers = ['ID', 'Product Name', 'Category', 'Quantity', 'Expiry Date', 'Status', 'Price', 'Supplier'];
        const rows = products.map(p => [
            p.id,
            `"${p.productName}"`,
            p.category,
            p.quantity,
            p.expiryDate,
            p.status,
            p.price || 0,
            p.supplier || ''
        ]);
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Log DSA operation
        this.storage.logDSAOperation('DATA STRUCTURE', 'EXPORT',
            `Exported ${products.length} products to CSV`);
        
        this.showSuccess(`Exported ${products.length} products to CSV`);
    }
    
    importFromCSV() {
        // For demo purposes, simulate CSV import
        const simulatedProducts = [
            {
                productName: 'Imported Apples',
                category: 'Fruits',
                quantity: 50,
                expiryDate: this.storage.getDateString(30),
                supplier: 'Import Supplier',
                price: 0.99
            },
            {
                productName: 'Imported Bananas',
                category: 'Fruits',
                quantity: 40,
                expiryDate: this.storage.getDateString(14),
                supplier: 'Import Supplier',
                price: 0.49
            }
        ];
        
        // Add simulated products
        simulatedProducts.forEach(product => {
            this.storage.addProduct(product);
        });
        
        // Reload inventory
        this.loadInventory();
        
        // Simulate backend import operation
        this.simulator.simulateOperation('ARRAY', 'BULK_INSERT',
            { count: simulatedProducts.length });
        
        this.showSuccess(`Imported ${simulatedProducts.length} products from CSV`);
    }
    
    simulateSync() {
        // Simulate sync with backend
        this.simulator.simulateSortProducts();
        this.simulator.simulateGetUrgentProduct();
        
        this.showSuccess('Synced with backend DSA operations');
    }
    
    // Modal methods
    showEditModal(product) {
        // Create modal for editing
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h5>Edit Product: ${product.productName}</h5>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="edit-product-form">
                        <div class="form-group">
                            <label>Product Name</label>
                            <input type="text" class="form-control" value="${product.productName}" required>
                        </div>
                        <div class="form-group">
                            <label>Category</label>
                            <input type="text" class="form-control" value="${product.category}" required>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <div class="form-group">
                                    <label>Quantity</label>
                                    <input type="number" class="form-control" value="${product.quantity}" min="0" required>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label>Expiry Date</label>
                                    <input type="date" class="form-control" value="${product.expiryDate}" required>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Style the modal
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        
        modal.querySelector('.modal-content').style.cssText = `
            background: white;
            border-radius: 12px;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideUp 0.3s ease;
        `;
        
        // Add form submit handler
        const form = modal.querySelector('#edit-product-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditFormSubmit(product.id, form);
            modal.remove();
        });
        
        // Add close button handler
        modal.querySelector('.close-btn').onclick = () => modal.remove();
        
        // Add to document
        document.body.appendChild(modal);
    }
    
    handleEditFormSubmit(productId, form) {
        const formData = {
            productName: form.querySelector('input[type="text"]').value,
            category: form.querySelectorAll('input[type="text"]')[1].value,
            quantity: parseInt(form.querySelector('input[type="number"]').value),
            expiryDate: form.querySelector('input[type="date"]').value
        };
        
        this.storage.updateProduct(productId, formData);
        this.loadInventory();
        
        this.showSuccess('Product updated successfully');
    }
    
    showProductDetails(product) {
        const daysLeft = this.calculateDaysUntilExpiry(product.expiryDate);
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h5>Product Details</h5>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="product-details">
                        <div class="detail-row">
                            <span class="detail-label">Product Name:</span>
                            <span class="detail-value">${product.productName}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Category:</span>
                            <span class="detail-value">${product.category}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Status:</span>
                            <span class="detail-value badge ${this.getStatusClass(product.status)}">
                                ${product.status}
                            </span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Days Until Expiry:</span>
                            <span class="detail-value">${daysLeft}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Priority:</span>
                            <span class="detail-value">${product.priority}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Quantity:</span>
                            <span class="detail-value">${product.quantity} units</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Expiry Date:</span>
                            <span class="detail-value">${new Date(product.expiryDate).toLocaleDateString()}</span>
                        </div>
                        ${product.supplier ? `
                        <div class="detail-row">
                            <span class="detail-label">Supplier:</span>
                            <span class="detail-value">${product.supplier}</span>
                        </div>` : ''}
                        ${product.price ? `
                        <div class="detail-row">
                            <span class="detail-label">Price:</span>
                            <span class="detail-value">$${product.price.toFixed(2)}</span>
                        </div>` : ''}
                        <div class="detail-row">
                            <span class="detail-label">Added Date:</span>
                            <span class="detail-value">${new Date(product.addedDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="inventoryManager.editProduct('${product.id}')">
                        Edit Product
                    </button>
                </div>
            </div>
        `;
        
        // Style the modal (similar to edit modal)
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        
        modal.querySelector('.modal-content').style.cssText = `
            background: white;
            border-radius: 12px;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideUp 0.3s ease;
        `;
        
        // Add close button handler
        modal.querySelector('.close-btn').onclick = () => modal.remove();
        
        // Add to document
        document.body.appendChild(modal);
    }
    
    calculateDaysUntilExpiry(expiryDate) {
        const today = new Date();
        const expiry = new Date(expiryDate);
        return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
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
        dashboardManager.showSuccess(message);
    }
    
    showError(message) {
        dashboardManager.showError(message);
    }
}

// Global inventory instance
const inventoryManager = new InventoryManager();

// Add modal styles
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .modal-overlay {
        backdrop-filter: blur(5px);
    }
    
    .modal-content {
        padding: 25px;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid #dee2e6;
    }
    
    .modal-header h5 {
        margin: 0;
        color: var(--text);
    }
    
    .modal-body {
        margin-bottom: 20px;
    }
    
    .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        padding-top: 15px;
        border-top: 1px solid #dee2e6;
    }
    
    .product-details {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #f8f9fa;
    }
    
    .detail-label {
        font-weight: 500;
        color: #666;
    }
    
    .detail-value {
        font-weight: 500;
        color: var(--text);
    }
    
    .quantity-display {
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .priority-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 10px;
    }
    
    .priority-high { background: #dc3545; }
    .priority-medium { background: #ffc107; }
    .priority-low { background: #28a745; }
`;
document.head.appendChild(modalStyles);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InventoryManager, inventoryManager };
}