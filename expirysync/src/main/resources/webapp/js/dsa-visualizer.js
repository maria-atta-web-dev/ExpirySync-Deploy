// frontend/js/dsa-visualizer.js
class DSAVisualizer {
    constructor() {
        this.container = null;
        this.isVisible = true;
        this.updateInterval = null;
        this.init();
    }
    
    init() {
        // Create floating button
        this.createFloatingButton();
        
        // Create visualization panel
        this.createVisualizationPanel();
        
        // Listen for DSA operations
        window.addEventListener('dsa-operation', (e) => {
            this.handleNewOperation(e.detail);
        });
        
        // Listen for storage updates
        window.addEventListener('storage', (e) => {
            if (e.key === storage.DSA_LOG_KEY) {
                this.updateVisualizations();
            }
        });
        
        // Initial update
        this.updateVisualizations();
        
        // Auto-update every 5 seconds
        this.updateInterval = setInterval(() => {
            this.updateVisualizations();
        }, 5000);
    }
    
    createFloatingButton() {
        const button = document.createElement('div');
        button.id = 'dsa-floating-button';
        button.innerHTML = `
            <i class="fas fa-project-diagram"></i>
            <span class="notification-badge" id="dsa-notification">0</span>
        `;
        button.onclick = () => this.togglePanel();
        document.body.appendChild(button);
    }
    
    createVisualizationPanel() {
        const panel = document.createElement('div');
        panel.id = 'dsa-visualizer-panel';
        panel.className = 'dsa-panel';
        panel.innerHTML = `
            <div class="dsa-header">
                <h4><i class="fas fa-project-diagram"></i> DSA Operations Live View</h4>
                <button class="close-btn" onclick="dsaVisualizer.togglePanel()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="dsa-structures">
                <div class="dsa-structure">
                    <h5><i class="fas fa-layer-group"></i> Stack (LIFO)</h5>
                    <small>Recent product additions</small>
                    <div class="stack-container" id="stack-visual"></div>
                </div>
                <div class="dsa-structure">
                    <h5><i class="fas fa-stream"></i> Queue (FIFO)</h5>
                    <small>Expiry processing order</small>
                    <div class="queue-container" id="queue-visual"></div>
                </div>
                <div class="dsa-structure">
                    <h5><i class="fas fa-sort-amount-up"></i> Priority Queue</h5>
                    <small>By expiry urgency (0=expired)</small>
                    <div class="priority-queue-container" id="priority-queue-visual"></div>
                </div>
                <div class="dsa-structure">
                    <h5><i class="fas fa-history"></i> Recent Operations</h5>
                    <div class="log-container" id="dsa-log"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        this.container = panel;
        
        // Make panel draggable
        this.makeDraggable(panel);
    }
    
    makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = element.querySelector('.dsa-header');
        
        if (header) {
            header.style.cursor = 'move';
            header.onmousedown = dragMouseDown;
        }
        
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            // Calculate new position
            const newTop = (element.offsetTop - pos2);
            const newLeft = (element.offsetLeft - pos1);
            
            // Keep within window bounds
            const maxTop = window.innerHeight - element.offsetHeight;
            const maxLeft = window.innerWidth - element.offsetWidth;
            
            element.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
            element.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
            element.style.right = 'auto';
            element.style.bottom = 'auto';
            element.style.position = 'fixed';
        }
        
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    
    togglePanel() {
        if (this.container) {
            this.isVisible = !this.isVisible;
            this.container.classList.toggle('collapsed');
            
            // Update button icon
            const button = document.getElementById('dsa-floating-button');
            if (button) {
                const icon = button.querySelector('i');
                if (icon) {
                    icon.className = this.isVisible ? 
                        'fas fa-times' : 'fas fa-project-diagram';
                }
            }
        }
    }
    
    updateVisualizations() {
        const products = storage.getProducts();
        const log = storage.getDSALog(10);
        
        // Update stack visualization (recent additions)
        this.updateStackVisualization(storage.getRecentAdditions(5));
        
        // Update queue visualization (expiry order)
        this.updateQueueVisualization(
            storage.getExpiringSoon(30).slice(0, 5)
        );
        
        // Update priority queue visualization
        this.updatePriorityQueueVisualization(
            [...products]
                .sort((a, b) => a.priority - b.priority)
                .slice(0, 5)
        );
        
        // Update operations log
        this.updateOperationsLog(log);
        
        // Update notification badge
        this.updateNotificationBadge();
    }
    
    updateStackVisualization(items) {
        const container = document.getElementById('stack-visual');
        if (!container) return;
        
        if (items.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>No recent additions</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = items.map((item, i) => `
            <div class="stack-item" style="--delay: ${i * 0.1}s">
                <div class="item-content">
                    <div class="item-name">${item.productName}</div>
                    <div class="item-position">${items.length - i}</div>
                </div>
            </div>
        `).join('');
    }
    
    updateQueueVisualization(items) {
        const container = document.getElementById('queue-visual');
        if (!container) return;
        
        if (items.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>No expiring items</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = items.map((item, i) => `
            <div class="queue-item" style="--delay: ${i * 0.1}s">
                <div class="queue-item-content">
                    <div class="queue-priority priority-${item.priority}">P${item.priority}</div>
                    <div class="queue-details">
                        <div class="queue-name">${item.productName}</div>
                        <div class="queue-time">${new Date(item.expiryDate).toLocaleDateString()}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    updatePriorityQueueVisualization(items) {
        const container = document.getElementById('priority-queue-visual');
        if (!container) return;
        
        if (items.length === 0) {
            container.innerHTML = `
                <div class="empty-priority">
                    <i class="fas fa-inbox"></i>
                    <p>Priority queue is empty</p>
                </div>
            `;
            return;
        }
        
        // Create heap visualization
        container.innerHTML = `
            <div class="heap-visualization">
                ${items.map((item, index) => `
                    <div class="heap-node" style="--level: ${Math.floor(Math.log2(index + 1))}">
                        <div class="node-priority priority-${item.priority}">${item.priority}</div>
                        <div class="node-name">${item.productName}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    updateOperationsLog(log) {
        const container = document.getElementById('dsa-log');
        if (!container) return;
        
        if (log.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <p>No operations yet</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = log.map(entry => `
            <div class="log-entry ${entry.structure.toLowerCase().replace(/\s+/g, '-')}">
                <div class="log-header">
                    <span class="log-time">${new Date(entry.timestamp).toLocaleTimeString()}</span>
                    <span class="log-structure">${entry.structure}</span>
                    <span class="log-operation">${entry.operation}</span>
                </div>
                <div class="log-description">${entry.description}</div>
            </div>
        `).join('');
    }
    
    updateNotificationBadge() {
        const badge = document.getElementById('dsa-notification');
        if (badge) {
            const recentLog = storage.getDSALog(20);
            const newCount = recentLog.filter(entry => 
                Date.now() - new Date(entry.timestamp).getTime() < 60000
            ).length;
            
            badge.textContent = newCount > 99 ? '99+' : newCount;
            badge.style.display = newCount > 0 ? 'flex' : 'none';
        }
    }
    
    handleNewOperation(operation) {
        // Highlight the panel
        if (this.container) {
            this.container.classList.add('animation-highlight');
            setTimeout(() => {
                this.container.classList.remove('animation-highlight');
            }, 1500);
        }
        
        // Update visualizations
        this.updateVisualizations();
        
        // Show toast notification
        this.showToast(operation);
    }
    
    showToast(operation) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'dsa-toast';
        toast.innerHTML = `
            <div class="toast-header">
                <span class="toast-structure">${operation.structure}</span>
                <span class="toast-operation">${operation.operation}</span>
                <button class="toast-close">&times;</button>
            </div>
            <div class="toast-body">${operation.description}</div>
        `;
        
        // Style the toast
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-left: 4px solid;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            z-index: 9999;
            max-width: 350px;
            animation: slideIn 0.3s ease;
        `;
        
        // Set border color based on structure
        const colors = {
            'STACK': '#0077C8',
            'QUEUE': '#00C853',
            'PRIORITY QUEUE': '#6f42c1',
            'ARRAY': '#ffc107',
            'DATA STRUCTURE': '#17a2b8'
        };
        
        toast.style.borderLeftColor = colors[operation.structure] || '#666';
        
        // Add close button handler
        toast.querySelector('.toast-close').onclick = () => {
            toast.remove();
        };
        
        // Add to document
        document.body.appendChild(toast);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }
    
    // Cleanup
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.container) {
            this.container.remove();
        }
        const button = document.getElementById('dsa-floating-button');
        if (button) {
            button.remove();
        }
    }
}

// Add CSS for toast animations
const toastStyles = document.createElement('style');
toastStyles.textContent = `
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
    
    .toast-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }
    
    .toast-structure {
        font-weight: bold;
        font-size: 0.9rem;
        padding: 3px 8px;
        border-radius: 4px;
        background: #f8f9fa;
    }
    
    .toast-operation {
        color: #0077C8;
        font-weight: 500;
        font-size: 0.85rem;
    }
    
    .toast-close {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
    }
    
    .toast-close:hover {
        background: #f8f9fa;
        color: #dc3545;
    }
    
    .toast-body {
        font-size: 0.9rem;
        color: #333;
        line-height: 1.4;
    }
`;
document.head.appendChild(toastStyles);

// Global visualizer instance
let dsaVisualizer = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    dsaVisualizer = new DSAVisualizer();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DSAVisualizer };
}