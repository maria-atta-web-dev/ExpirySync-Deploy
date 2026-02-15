// frontend/js/dsa-demo.js
class DSADemo {
    constructor() {
        this.stackItems = [];
        this.queueItems = [];
        this.priorityItems = [];
        this.operationCount = 0;
        this.productCounter = 1;
    }
    
    initStackDemo() {
        // Initialize with some stack items
        this.stackItems = ['Milk', 'Eggs', 'Bread'];
        this.updateStackVisualization();
        
        // Log initial state
        this.logOperation('STACK', 'Initialized', 
            'Stack demo loaded with 3 sample products');
    }
    
    initQueueDemo() {
        this.queueItems = [
            { name: 'Expired Yogurt', priority: 0 },
            { name: 'Expiring Milk', priority: 1 },
            { name: 'Expiring Cheese', priority: 2 }
        ];
        this.updateQueueVisualization();
    }
    
    initPriorityDemo() {
        this.priorityItems = [
            { name: 'Milk (Expired)', priority: 0 },
            { name: 'Eggs (3 days)', priority: 1 },
            { name: 'Cheese (5 days)', priority: 2 },
            { name: 'Bread (10 days)', priority: 3 }
        ].sort((a, b) => a.priority - b.priority);
        
        this.updatePriorityVisualization();
    }
    
    // STACK OPERATIONS
    stackPush() {
        const products = ['Apples', 'Bananas', 'Carrots', 'Yogurt', 'Juice'];
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const newProduct = `${randomProduct} #${this.productCounter++}`;
        
        this.stackItems.push(newProduct);
        this.updateStackVisualization();
        
        this.logOperation('STACK', 'PUSH', 
            `Added "${newProduct}" to top of stack (LIFO)`);
        
        // Show Java code
        this.showCodeExample(`
// Java Stack Push Operation
public class InventoryStack {
    Stack<String> productStack = new Stack<>();
    
    public void addProduct(String productName) {
        productStack.push(productName);
        System.out.println("Pushed to stack: " + productName);
        // Stack size: ${this.stackItems.length}
    }
}`);
    }
    
    stackPop() {
        if (this.stackItems.length === 0) {
            alert('Stack is empty! Push items first.');
            return;
        }
        
        const poppedItem = this.stackItems.pop();
        this.updateStackVisualization();
        
        this.logOperation('STACK', 'POP', 
            `Removed "${poppedItem}" from top of stack`);
        
        this.showCodeExample(`
// Java Stack Pop Operation
public class InventoryStack {
    public String removeRecentProduct() {
        if (productStack.isEmpty()) {
            return "Stack is empty";
        }
        String removed = productStack.pop();
        System.out.println("Popped from stack: " + removed);
        // Remaining items: ${this.stackItems.length}
        return removed;
    }
}`);
    }
    
    stackPeek() {
        if (this.stackItems.length === 0) {
            alert('Stack is empty!');
            return;
        }
        
        const topItem = this.stackItems[this.stackItems.length - 1];
        
        this.logOperation('STACK', 'PEEK', 
            `Viewed top item: "${topItem}" (not removed)`);
        
        // Highlight the top item
        const stackVisual = document.getElementById('stack-visual-demo');
        const items = stackVisual.querySelectorAll('.stack-item');
        if (items.length > 0) {
            items[items.length - 1].classList.add('highlight');
            setTimeout(() => {
                items[items.length - 1].classList.remove('highlight');
            }, 1000);
        }
        
        this.showCodeExample(`
// Java Stack Peek Operation
public class InventoryStack {
    public String viewRecentProduct() {
        if (productStack.isEmpty()) {
            return "Stack is empty";
        }
        String topItem = productStack.peek();
        System.out.println("Top item (not removed): " + topItem);
        // Stack remains unchanged
        return topItem;
    }
}`);
    }
    
    updateStackVisualization() {
        const container = document.getElementById('stack-visual-demo');
        if (!container) return;
        
        // Clear existing items except base
        const base = container.querySelector('.stack-base');
        container.innerHTML = '';
        if (base) container.appendChild(base);
        
        // Add stack items
        this.stackItems.forEach((item, index) => {
            const stackItem = document.createElement('div');
            stackItem.className = 'stack-item';
            stackItem.style = `--index: ${index}`;
            stackItem.innerHTML = `
                <div class="item-content">
                    <div class="item-name">${item}</div>
                    <div class="item-position">#${this.stackItems.length - index}</div>
                </div>
            `;
            container.appendChild(stackItem);
        });
        
        // Update stack log
        const logContainer = document.getElementById('stack-log');
        if (logContainer) {
            logContainer.innerHTML = `
                <div class="log-entry">
                    <strong>Stack Status:</strong>
                    <span>${this.stackItems.length} items</span>
                    <span>Top: ${this.stackItems.length > 0 ? this.stackItems[this.stackItems.length - 1] : 'Empty'}</span>
                </div>
            `;
        }
    }
    
    // QUEUE OPERATIONS
    queueEnqueue() {
        const statuses = ['Expired', 'Expiring Soon', 'Near Expiry'];
        const products = ['Yogurt', 'Milk', 'Cheese', 'Butter', 'Cream'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        
        const newItem = {
            name: `${randomProduct} (${randomStatus})`,
            priority: randomStatus === 'Expired' ? 0 : 
                     randomStatus === 'Expiring Soon' ? 1 : 2,
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.queueItems.push(newItem);
        this.updateQueueVisualization();
        
        this.logOperation('QUEUE', 'ENQUEUE', 
            `Added "${newItem.name}" to rear of queue (FIFO)`);
        
        this.showCodeExample(`
// Java Queue Enqueue Operation
public class ExpiryQueue {
    Queue<Product> expiryQueue = new LinkedList<>();
    
    public void addToExpiryQueue(Product product) {
        expiryQueue.add(product);
        System.out.println("Enqueued: " + product.getName());
        // Queue size: ${this.queueItems.length}
        // Priority: ${newItem.priority}
    }
}`);
    }
    
    queueDequeue() {
        if (this.queueItems.length === 0) {
            alert('Queue is empty! Enqueue items first.');
            return;
        }
        
        const dequeuedItem = this.queueItems.shift();
        this.updateQueueVisualization();
        
        this.logOperation('QUEUE', 'DEQUEUE', 
            `Processed "${dequeuedItem.name}" from front of queue`);
        
        this.showCodeExample(`
// Java Queue Dequeue Operation
public class ExpiryQueue {
    public Product processNextExpired() {
        if (expiryQueue.isEmpty()) {
            return null;
        }
        Product processed = expiryQueue.poll();
        System.out.println("Dequeued: " + processed.getName());
        // Remaining in queue: ${this.queueItems.length}
        return processed;
    }
}`);
    }
    
    updateQueueVisualization() {
        const container = document.getElementById('queue-visual-demo');
        if (!container) return;
        
        // Clear existing items except labels
        const labels = container.querySelectorAll('.queue-label');
        container.innerHTML = '';
        labels.forEach(label => container.appendChild(label));
        
        // Add queue items
        this.queueItems.forEach((item, index) => {
            const queueItem = document.createElement('div');
            queueItem.className = 'queue-item';
            queueItem.style = `--order: ${index + 1}`;
            queueItem.innerHTML = `
                <div class="queue-item-content">
                    <div class="queue-priority priority-${item.priority}">P${item.priority}</div>
                    <div class="queue-details">
                        <div class="queue-name">${item.name}</div>
                        <div class="queue-time">${item.timestamp}</div>
                    </div>
                </div>
            `;
            
            // Insert before rear label
            const rearLabel = container.querySelector('.queue-label:last-child');
            container.insertBefore(queueItem, rearLabel);
        });
        
        // Update queue log
        const logContainer = document.getElementById('queue-log');
        if (logContainer) {
            logContainer.innerHTML = `
                <div class="log-entry">
                    <strong>Queue Status:</strong>
                    <span>${this.queueItems.length} items waiting</span>
                    <span>Next: ${this.queueItems.length > 0 ? this.queueItems[0].name : 'Empty'}</span>
                </div>
            `;
        }
    }
    
    // PRIORITY QUEUE OPERATIONS
    priorityInsert() {
        const products = [
            { name: 'Expired Milk', priority: 0 },
            { name: 'Expiring Eggs (1 day)', priority: 1 },
            { name: 'Expiring Cheese (3 days)', priority: 2 },
            { name: 'Bread (7 days)', priority: 3 },
            { name: 'Canned Food (30 days)', priority: 4 }
        ];
        
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const newItem = {
            ...randomProduct,
            id: Date.now()
        };
        
        this.priorityItems.push(newItem);
        // Sort by priority (lower number = higher priority)
        this.priorityItems.sort((a, b) => a.priority - b.priority);
        this.updatePriorityVisualization();
        
        this.logOperation('PRIORITY QUEUE', 'INSERT', 
            `Added "${newItem.name}" with priority ${newItem.priority}`);
        
        this.showCodeExample(`
// Java Priority Queue Insert
public class PriorityExpiryQueue {
    PriorityQueue<Product> pq = new PriorityQueue<>(
        (a, b) -> a.getPriority() - b.getPriority()
    );
    
    public void addUrgentItem(Product product) {
        pq.offer(product);
        System.out.println("Added: " + product.getName() + 
            " (Priority: " + product.getPriority() + ")");
        // Queue maintains heap property automatically
    }
}`);
    }
    
    priorityRemove() {
        if (this.priorityItems.length === 0) {
            alert('Priority queue is empty!');
            return;
        }
        
        const removedItem = this.priorityItems.shift(); // Remove highest priority (first item)
        this.updatePriorityVisualization();
        
        this.logOperation('PRIORITY QUEUE', 'REMOVE', 
            `Processed highest priority: "${removedItem.name}" (Priority: ${removedItem.priority})`);
        
        this.showCodeExample(`
// Java Priority Queue Remove
public class PriorityExpiryQueue {
    public Product processMostUrgent() {
        Product urgent = pq.poll(); // O(log n)
        if (urgent != null) {
            System.out.println("Processing: " + urgent.getName() + 
                " (Priority: " + urgent.getPriority() + ")");
        }
        return urgent;
    }
}`);
    }
    
    updatePriorityVisualization() {
        const container = document.getElementById('priority-visual-demo');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (this.priorityItems.length === 0) {
            container.innerHTML = `
                <div class="empty-priority">
                    <i class="fas fa-inbox"></i>
                    <p>Priority queue is empty</p>
                </div>
            `;
            return;
        }
        
        // Create heap visualization
        const heapContainer = document.createElement('div');
        heapContainer.className = 'heap-visualization';
        
        // Visualize as binary heap
        this.priorityItems.forEach((item, index) => {
            const heapNode = document.createElement('div');
            heapNode.className = 'heap-node';
            heapNode.style = `--level: ${Math.floor(Math.log2(index + 1))}`;
            heapNode.innerHTML = `
                <div class="node-priority priority-${item.priority}">
                    ${item.priority}
                </div>
                <div class="node-name">${item.name}</div>
            `;
            
            heapContainer.appendChild(heapNode);
        });
        
        container.appendChild(heapContainer);
        
        // Update priority log
        const logContainer = document.getElementById('priority-log');
        if (logContainer) {
            const highestPriority = this.priorityItems.length > 0 ? 
                this.priorityItems[0] : null;
            
            logContainer.innerHTML = `
                <div class="log-entry">
                    <strong>Priority Queue Status:</strong>
                    <span>${this.priorityItems.length} items</span>
                    <span>Highest priority: ${highestPriority ? 
                        `${highestPriority.name} (P${highestPriority.priority})` : 'None'}</span>
                </div>
            `;
        }
    }
    
    // UTILITY METHODS
    logOperation(structure, operation, description) {
        this.operationCount++;
        
        const logEntry = {
            id: this.operationCount,
            timestamp: new Date().toLocaleTimeString(),
            structure,
            operation,
            description
        };
        
        // Update real-time log
        const logContainer = document.getElementById('real-time-log');
        if (logContainer) {
            const logElement = document.createElement('div');
            logElement.className = `log-entry ${structure.toLowerCase()}`;
            logElement.innerHTML = `
                <div class="log-header">
                    <span class="log-time">${logEntry.timestamp}</span>
                    <span class="log-structure">${logEntry.structure}</span>
                    <span class="log-operation">${logEntry.operation}</span>
                </div>
                <div class="log-description">${logEntry.description}</div>
            `;
            
            // Add to top of log
            logContainer.insertBefore(logElement, logContainer.firstChild);
            
            // Keep only last 10 entries
            const entries = logContainer.querySelectorAll('.log-entry');
            if (entries.length > 10) {
                entries[entries.length - 1].remove();
            }
        }
        
        // Also save to storage for cross-page access
        const existingLog = JSON.parse(localStorage.getItem('dsa_demo_log') || '[]');
        existingLog.unshift(logEntry);
        if (existingLog.length > 20) existingLog.pop();
        localStorage.setItem('dsa_demo_log', JSON.stringify(existingLog));
    }
    
    showCodeExample(code) {
        // Create or update code display
        let codeDisplay = document.getElementById('code-example-display');
        if (!codeDisplay) {
            codeDisplay = document.createElement('div');
            codeDisplay.id = 'code-example-display';
            codeDisplay.className = 'code-display-overlay';
            document.body.appendChild(codeDisplay);
        }
        
        codeDisplay.innerHTML = `
            <div class="code-display-content">
                <div class="code-header">
                    <h5><i class="fas fa-code"></i> Java Implementation</h5>
                    <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <pre><code class="java">${code}</code></pre>
                <div class="code-footer">
                    <small>This Java code runs in backend when you perform this action</small>
                </div>
            </div>
        `;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (codeDisplay && codeDisplay.parentElement) {
                codeDisplay.remove();
            }
        }, 5000);
    }
    
    clearOperationsLog() {
        const logContainer = document.getElementById('real-time-log');
        if (logContainer) {
            logContainer.innerHTML = '';
        }
        localStorage.removeItem('dsa_demo_log');
        this.operationCount = 0;
    }
    
    // SORTING DEMO
    demonstrateSorting() {
        const unsorted = [
            { name: 'Milk', expiry: 2 },
            { name: 'Eggs', expiry: 30 },
            { name: 'Bread', expiry: -1 },
            { name: 'Cheese', expiry: 7 },
            { name: 'Yogurt', expiry: 1 }
        ];
        
        this.logOperation('SORTING', 'QUICK SORT', 
            'Sorting products by expiry date (ascending)');
        
        // Visualize sorting steps
        this.visualizeSorting(unsorted);
    }
    
    visualizeSorting(items) {
        const steps = [];
        const sorted = [...items].sort((a, b) => a.expiry - b.expiry);
        
        // Log sorting result
        setTimeout(() => {
            this.logOperation('SORTING', 'COMPLETED', 
                `Sorted ${items.length} products. Result: ` + 
                sorted.map(i => `${i.name}(${i.expiry}d)`).join(', '));
        }, 1000);
    }
    
    // SEARCHING DEMO
    demonstrateSearching() {
        const products = [
            { id: 1, name: 'Apple' },
            { id: 2, name: 'Banana' },
            { id: 3, name: 'Carrot' },
            { id: 4, name: 'Dates' },
            { id: 5, name: 'Eggplant' }
        ].sort((a, b) => a.name.localeCompare(b.name)); // Sorted for binary search
        
        this.logOperation('SEARCHING', 'BINARY SEARCH', 
            'Searching for product "Carrot" in sorted array');
        
        // Simulate binary search
        this.simulateBinarySearch(products, 'Carrot');
    }
    
    simulateBinarySearch(array, target) {
        let steps = [];
        let left = 0;
        let right = array.length - 1;
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            steps.push(`Checking index ${mid}: "${array[mid].name}"`);
            
            if (array[mid].name === target) {
                steps.push(`Found "${target}" at index ${mid}`);
                break;
            } else if (array[mid].name < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        // Log search steps
        steps.forEach((step, i) => {
            setTimeout(() => {
                this.logOperation('SEARCHING', `STEP ${i + 1}`, step);
            }, i * 500);
        });
    }
}

// Global instance
const dsaDemo = new DSADemo();

// Global functions for HTML onclick handlers
function stackPush() { dsaDemo.stackPush(); }
function stackPop() { dsaDemo.stackPop(); }
function stackPeek() { dsaDemo.stackPeek(); }
function queueEnqueue() { dsaDemo.queueEnqueue(); }
function queueDequeue() { dsaDemo.queueDequeue(); }
function priorityInsert() { dsaDemo.priorityInsert(); }
function priorityRemove() { dsaDemo.priorityRemove(); }
function clearOperationsLog() { dsaDemo.clearOperationsLog(); }

// Initialize all demos
function initStackDemo() { dsaDemo.initStackDemo(); }
function initQueueDemo() { dsaDemo.initQueueDemo(); }
function initPriorityDemo() { dsaDemo.initPriorityDemo(); }

// Live updates for real-time log
function startLiveUpdates() {
    setInterval(() => {
        // Update real-time log from storage
        const storedLog = JSON.parse(localStorage.getItem('dsa_operations_log') || '[]');
        const recentLog = storedLog.slice(0, 3); // Get 3 most recent
        
        const logContainer = document.getElementById('real-time-log');
        if (logContainer && recentLog.length > 0) {
            // Add new entries that aren't already displayed
            recentLog.forEach(entry => {
                const existing = logContainer.querySelector(`[data-id="${entry.timestamp}"]`);
                if (!existing) {
                    const logElement = document.createElement('div');
                    logElement.className = `log-entry ${entry.structure.toLowerCase()}`;
                    logElement.dataset.id = entry.timestamp;
                    logElement.innerHTML = `
                        <div class="log-header">
                            <span class="log-time">${new Date(entry.timestamp).toLocaleTimeString()}</span>
                            <span class="log-structure">${entry.structure}</span>
                            <span class="log-operation">${entry.operation}</span>
                        </div>
                        <div class="log-description">${entry.description}</div>
                    `;
                    
                    // Add to top
                    if (logContainer.firstChild) {
                        logContainer.insertBefore(logElement, logContainer.firstChild);
                    } else {
                        logContainer.appendChild(logElement);
                    }
                    
                    // Keep only last 15 entries
                    const entries = logContainer.querySelectorAll('.log-entry');
                    if (entries.length > 15) {
                        entries[entries.length - 1].remove();
                    }
                }
            });
        }
    }, 2000); // Update every 2 seconds
}

// Demo sorting and searching
function demoSorting() {
    dsaDemo.demonstrateSorting();
}

function demoSearching() {
    dsaDemo.demonstrateSearching();
}

// Auto-start demos when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on DSA demo page
    if (window.location.pathname.includes('dsa-demo.html') || 
        window.location.href.includes('dsa-demo')) {
        
        // Initialize all demos
        if (typeof dsaDemo.initStackDemo === 'function') dsaDemo.initStackDemo();
        if (typeof dsaDemo.initQueueDemo === 'function') dsaDemo.initQueueDemo();
        if (typeof dsaDemo.initPriorityDemo === 'function') dsaDemo.initPriorityDemo();
        
        // Start live updates
        startLiveUpdates();
        
        // Load any existing log from storage
        const storedLog = JSON.parse(localStorage.getItem('dsa_demo_log') || '[]');
        storedLog.forEach(entry => {
            dsaDemo.logOperation(entry.structure, entry.operation, entry.description);
        });
    }
});