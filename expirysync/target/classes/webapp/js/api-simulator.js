// frontend/js/api-simulator.js
class DSASimulator {
    constructor() {
        this.storage = storage;
        this.operations = [];
        this.initJavaCodeExamples();
    }
    
    initJavaCodeExamples() {
        this.javaExamples = {
            STACK_PUSH: `// Java Stack Implementation - Push Operation
class InventoryStack {
    private Stack<Product> productStack = new Stack<>();
    
    public void addProduct(Product product) {
        // Push product onto stack (LIFO)
        productStack.push(product);
        
        // Update product status based on expiry
        updateProductStatus(product);
        
        // Log the operation
        System.out.println("Pushed to stack: " + product.getName());
        System.out.println("Stack size: " + productStack.size());
    }
    
    private void updateProductStatus(Product product) {
        LocalDate today = LocalDate.now();
        long daysUntilExpiry = ChronoUnit.DAYS.between(today, product.getExpiryDate());
        
        if (daysUntilExpiry < 0) {
            product.setStatus("Expired");
            product.setPriority(0);
        } else if (daysUntilExpiry <= 7) {
            product.setStatus("Expiring Soon");
            product.setPriority(1);
        } else {
            product.setStatus("Healthy");
            product.setPriority(2);
        }
    }
}`,

            STACK_POP: `// Java Stack Implementation - Pop Operation
class InventoryStack {
    public Product removeRecentProduct() {
        if (productStack.isEmpty()) {
            throw new EmptyStackException("Stack is empty!");
        }
        
        // Pop from stack (LIFO - Last In First Out)
        Product removedProduct = productStack.pop();
        
        // Log removal
        System.out.println("Popped from stack: " + removedProduct.getName());
        System.out.println("Remaining items: " + productStack.size());
        
        return removedProduct;
    }
    
    public Product peekRecentProduct() {
        // Peek at top without removing
        return productStack.peek();
    }
}`,

            QUEUE_ENQUEUE: `// Java Queue Implementation - Enqueue Operation
class ExpiryQueue {
    private Queue<Product> expiryQueue = new LinkedList<>();
    
    public void addToExpiryQueue(Product product) {
        // Add to end of queue (FIFO)
        expiryQueue.add(product);
        
        // Sort by expiry date for processing order
        sortQueueByExpiry();
        
        System.out.println("Enqueued: " + product.getName());
        System.out.println("Queue size: " + expiryQueue.size());
    }
    
    private void sortQueueByExpiry() {
        // Convert to list, sort, and rebuild queue
        List<Product> sortedList = new ArrayList<>(expiryQueue);
        sortedList.sort(Comparator.comparing(Product::getExpiryDate));
        
        expiryQueue.clear();
        expiryQueue.addAll(sortedList);
    }
}`,

            QUEUE_DEQUEUE: `// Java Queue Implementation - Dequeue Operation
class ExpiryQueue {
    public Product processNextExpired() {
        if (expiryQueue.isEmpty()) {
            return null;
        }
        
        // Remove from front of queue (FIFO)
        Product expiredProduct = expiryQueue.poll();
        
        if (expiredProduct != null) {
            // Apply discount based on expiry
            applyDiscount(expiredProduct);
            
            System.out.println("Dequeued: " + expiredProduct.getName());
            System.out.println("Days expired: " + 
                ChronoUnit.DAYS.between(expiredProduct.getExpiryDate(), LocalDate.now()));
        }
        
        return expiredProduct;
    }
    
    private void applyDiscount(Product product) {
        long daysExpired = ChronoUnit.DAYS.between(product.getExpiryDate(), LocalDate.now());
        double discount = 0;
        
        if (daysExpired >= 0) {
            discount = 0.5; // 50% off for expired
        } else if (daysExpired >= -3) {
            discount = 0.3; // 30% off for expiring in 3 days
        } else if (daysExpired >= -7) {
            discount = 0.1; // 10% off for expiring in 7 days
        }
        
        product.setDiscount(discount);
    }
}`,

            PRIORITY_QUEUE_INSERT: `// Java Priority Queue Implementation - Insert
class PriorityExpiryQueue {
    private PriorityQueue<Product> priorityQueue = 
        new PriorityQueue<>(Comparator.comparingInt(Product::getPriority));
    
    public void addUrgentProduct(Product product) {
        // Calculate priority based on expiry
        int priority = calculatePriority(product.getExpiryDate());
        product.setPriority(priority);
        
        // Insert into priority queue (min-heap)
        priorityQueue.offer(product);
        
        System.out.println("Added to priority queue: " + product.getName());
        System.out.println("Priority: " + priority);
        System.out.println("Queue maintains heap property automatically");
    }
    
    private int calculatePriority(LocalDate expiryDate) {
        LocalDate today = LocalDate.now();
        long daysUntilExpiry = ChronoUnit.DAYS.between(today, expiryDate);
        
        if (daysUntilExpiry < 0) return 0; // Expired
        if (daysUntilExpiry <= 3) return 1; // Urgent
        if (daysUntilExpiry <= 7) return 2; // Soon
        if (daysUntilExpiry <= 15) return 3; // Warning
        return 4; // Healthy
    }
}`,

            PRIORITY_QUEUE_REMOVE: `// Java Priority Queue Implementation - Remove
class PriorityExpiryQueue {
    public Product getMostUrgentProduct() {
        // Peek at highest priority (lowest number) without removing
        return priorityQueue.peek();
    }
    
    public Product processMostUrgent() {
        // Remove and return highest priority product
        Product urgent = priorityQueue.poll();
        
        if (urgent != null) {
            System.out.println("Processing urgent product: " + urgent.getName());
            System.out.println("Priority: " + urgent.getPriority());
            System.out.println("Time complexity: O(log n) for heap rebalancing");
        }
        
        return urgent;
    }
    
    public List<Product> getAllByPriority() {
        // Get all products sorted by priority
        List<Product> sorted = new ArrayList<>(priorityQueue);
        sorted.sort(Comparator.comparingInt(Product::getPriority));
        return sorted;
    }
}`,

            QUICK_SORT: `// Java Quick Sort Implementation
class ProductSorter {
    public void sortByExpiryDate(List<Product> products) {
        quickSort(products, 0, products.size() - 1);
    }
    
    private void quickSort(List<Product> products, int low, int high) {
        if (low < high) {
            // Partition the array
            int pi = partition(products, low, high);
            
            // Recursively sort elements before and after partition
            quickSort(products, low, pi - 1);
            quickSort(products, pi + 1, high);
            
            System.out.println("Quick Sort partition index: " + pi);
            System.out.println("Time complexity: O(n log n) average");
        }
    }
    
    private int partition(List<Product> products, int low, int high) {
        // Choose pivot (last element)
        Product pivot = products.get(high);
        int i = low - 1;
        
        for (int j = low; j < high; j++) {
            // Compare expiry dates
            if (products.get(j).getExpiryDate()
                    .compareTo(pivot.getExpiryDate()) <= 0) {
                i++;
                
                // Swap products
                Product temp = products.get(i);
                products.set(i, products.get(j));
                products.set(j, temp);
            }
        }
        
        // Swap pivot to correct position
        Product temp = products.get(i + 1);
        products.set(i + 1, products.get(high));
        products.set(high, temp);
        
        return i + 1;
    }
}`,

            BINARY_SEARCH: `// Java Binary Search Implementation
class ProductSearch {
    public Product searchByName(List<Product> products, String targetName) {
        // Binary search requires sorted array
        products.sort(Comparator.comparing(Product::getName));
        
        int left = 0;
        int right = products.size() - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            Product midProduct = products.get(mid);
            
            System.out.println("Binary Search - Checking index " + mid + 
                ": " + midProduct.getName());
            
            int comparison = midProduct.getName().compareTo(targetName);
            
            if (comparison == 0) {
                // Found the product
                System.out.println("Found product at index: " + mid);
                System.out.println("Time complexity: O(log n)");
                return midProduct;
            } else if (comparison < 0) {
                // Search in right half
                left = mid + 1;
            } else {
                // Search in left half
                right = mid - 1;
            }
        }
        
        System.out.println("Product not found: " + targetName);
        return null;
    }
    
    public List<Product> searchByCategory(List<Product> products, String category) {
        // Linear search for category (can't use binary search for this)
        List<Product> result = new ArrayList<>();
        
        for (Product product : products) {
            if (product.getCategory().equals(category)) {
                result.add(product);
            }
        }
        
        System.out.println("Found " + result.size() + " products in category: " + category);
        System.out.println("Time complexity: O(n) for linear search");
        
        return result;
    }
}`
        };
    }
    
    // Simulate backend operations
    simulateOperation(operationType, data) {
        const operation = {
            id: 'sim_' + Date.now(),
            type: operationType,
            data: data,
            timestamp: new Date().toISOString(),
            javaCode: this.getJavaCode(operationType),
            dsaStructure: this.getDSAStructure(operationType)
        };
        
        this.operations.unshift(operation);
        
        // Log to storage
        this.storage.logDSAOperation(
            operation.dsaStructure,
            this.getOperationName(operationType),
            this.getOperationDescription(operationType, data)
        );
        
        // Show Java code
        this.showJavaCode(operation);
        
        return operation;
    }
    
    getJavaCode(operationType) {
        return this.javaExamples[operationType] || 
            `// Java code for ${operationType}\n// Implementation would go here`;
    }
    
    getDSAStructure(operationType) {
        const structureMap = {
            'STACK_PUSH': 'STACK',
            'STACK_POP': 'STACK',
            'QUEUE_ENQUEUE': 'QUEUE',
            'QUEUE_DEQUEUE': 'QUEUE',
            'PRIORITY_QUEUE_INSERT': 'PRIORITY QUEUE',
            'PRIORITY_QUEUE_REMOVE': 'PRIORITY QUEUE',
            'QUICK_SORT': 'SORTING',
            'BINARY_SEARCH': 'SEARCHING'
        };
        
        return structureMap[operationType] || 'DATA STRUCTURE';
    }
    
    getOperationName(operationType) {
        const nameMap = {
            'STACK_PUSH': 'PUSH',
            'STACK_POP': 'POP',
            'QUEUE_ENQUEUE': 'ENQUEUE',
            'QUEUE_DEQUEUE': 'DEQUEUE',
            'PRIORITY_QUEUE_INSERT': 'INSERT',
            'PRIORITY_QUEUE_REMOVE': 'REMOVE',
            'QUICK_SORT': 'QUICK SORT',
            'BINARY_SEARCH': 'BINARY SEARCH'
        };
        
        return nameMap[operationType] || 'OPERATION';
    }
    
    getOperationDescription(operationType, data) {
        const descriptions = {
            'STACK_PUSH': `Added "${data?.productName || 'product'}" to inventory stack`,
            'STACK_POP': 'Removed most recent product from stack',
            'QUEUE_ENQUEUE': `Added "${data?.productName || 'product'}" to expiry queue`,
            'QUEUE_DEQUEUE': 'Processed next expired product from queue',
            'PRIORITY_QUEUE_INSERT': `Inserted "${data?.productName || 'product'}" into priority queue`,
            'PRIORITY_QUEUE_REMOVE': 'Removed highest priority product',
            'QUICK_SORT': 'Sorted products by expiry date using Quick Sort',
            'BINARY_SEARCH': `Searching for "${data?.searchTerm || 'product'}" using Binary Search`
        };
        
        return descriptions[operationType] || 'Performed DSA operation';
    }
    
    showJavaCode(operation) {
        // Create code display
        const codeDisplay = document.createElement('div');
        codeDisplay.className = 'code-display-overlay';
        codeDisplay.innerHTML = `
            <div class="code-display-content">
                <div class="code-header">
                    <h5><i class="fas fa-code"></i> Java Backend - ${operation.dsaStructure}</h5>
                    <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <pre><code>${this.highlightJavaCode(operation.javaCode)}</code></pre>
                <div class="code-footer">
                    <div class="row">
                        <div class="col-6">
                            <small><i class="fas fa-microchip"></i> DSA Structure: ${operation.dsaStructure}</small>
                        </div>
                        <div class="col-6 text-right">
                            <small><i class="fas fa-clock"></i> ${new Date(operation.timestamp).toLocaleTimeString()}</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(codeDisplay);
        
        // Auto-hide after 7 seconds
        setTimeout(() => {
            if (codeDisplay.parentElement) {
                codeDisplay.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => codeDisplay.remove(), 300);
            }
        }, 7000);
    }
    
    highlightJavaCode(code) {
        // Simple syntax highlighting
        return code
            .replace(/\/\/.*$/gm, '<span class="comment">$&</span>')
            .replace(/\b(class|public|private|void|return|new|if|else|for|while|try|catch)\b/g, 
                '<span class="keyword">$1</span>')
            .replace(/\b(Stack|Queue|PriorityQueue|List|ArrayList|LinkedList|Product|LocalDate)\b/g, 
                '<span class="class">$1</span>')
            .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
            .replace(/\b(addProduct|removeRecentProduct|processNextExpired|searchByName)\b/g,
                '<span class="method">$1</span>');
    }
    
    // Simulation methods for different operations
    simulateAddProduct(productData) {
        return this.simulateOperation('STACK_PUSH', productData);
    }
    
    simulateRemoveProduct(productId) {
        const product = this.storage.getProduct(productId);
        return this.simulateOperation('STACK_POP', product);
    }
    
    simulateProcessExpired() {
        const expired = this.storage.getProducts()
            .filter(p => p.status === 'Expired')
            .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))[0];
        
        return this.simulateOperation('QUEUE_DEQUEUE', expired);
    }
    
    simulateSortProducts() {
        return this.simulateOperation('QUICK_SORT', { 
            count: this.storage.getProducts().length 
        });
    }
    
    simulateSearchProduct(searchTerm) {
        return this.simulateOperation('BINARY_SEARCH', { searchTerm });
    }
    
    simulateGetUrgentProduct() {
        const urgent = this.storage.getMostUrgentProduct();
        return this.simulateOperation('PRIORITY_QUEUE_REMOVE', urgent);
    }
    
    // Batch simulation
    simulateAllOperations() {
        const operations = [
            () => this.simulateAddProduct({ productName: 'Test Product' }),
            () => this.simulateSortProducts(),
            () => this.simulateSearchProduct('Milk'),
            () => this.simulateGetUrgentProduct(),
            () => this.simulateProcessExpired()
        ];
        
        let delay = 0;
        operations.forEach((op, index) => {
            setTimeout(() => {
                op.call(this);
            }, delay);
            delay += 1500;
        });
    }
    
    // Get simulation history
    getSimulationHistory(limit = 10) {
        return this.operations.slice(0, limit);
    }
    
    // Clear simulation history
    clearSimulationHistory() {
        this.operations = [];
    }
}

// Global simulator instance
const dsaSimulator = new DSASimulator();

// Add CSS for code highlighting
const codeHighlightStyles = document.createElement('style');
codeHighlightStyles.textContent = `
    .keyword { color: #ff79c6; }
    .class { color: #8be9fd; }
    .string { color: #f1fa8c; }
    .comment { color: #6272a4; font-style: italic; }
    .method { color: #50fa7b; }
`;
document.head.appendChild(codeHighlightStyles);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DSASimulator, dsaSimulator };
}