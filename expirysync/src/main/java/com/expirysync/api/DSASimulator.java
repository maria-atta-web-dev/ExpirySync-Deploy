package com.expirysync.api;

import com.expirysync.dsa.DSAOperations;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

public class DSASimulator {
    private DSAOperations dsaOperations;
    private Map<String, String> operationLog;
    
    public DSASimulator() {
        this.dsaOperations = new DSAOperations();
        this.operationLog = new HashMap<>();
        System.out.println("DSA Simulator initialized");
    }
    
    public Map<String, Object> simulateAddProduct(Map<String, Object> productData) {
        System.out.println("\n[API] Adding product: " + productData);
        
        // Create product
        DSAOperations.Product product = new DSAOperations.Product();
        product.setId("PROD_" + System.currentTimeMillis());
        product.setName((String) productData.getOrDefault("name", "Unknown"));
        product.setCategory((String) productData.getOrDefault("category", "General"));
        
        // Handle quantity
        Object qty = productData.get("quantity");
        if (qty instanceof String) {
            product.setQuantity(Integer.parseInt((String) qty));
        } else if (qty instanceof Number) {
            product.setQuantity(((Number) qty).intValue());
        } else {
            product.setQuantity(1);
        }
        
        // Handle price
        Object price = productData.get("price");
        if (price instanceof String) {
            product.setPrice(Double.parseDouble((String) price));
        } else if (price instanceof Number) {
            product.setPrice(((Number) price).doubleValue());
        } else {
            product.setPrice(0.0);
        }
        
        product.setExpiryDate(LocalDate.now().plusDays(30));
        product.setSupplier((String) productData.getOrDefault("supplier", "Unknown"));
        
        // Add to DSA operations
        dsaOperations.addProduct(product);
        
        // Log operation
        operationLog.put("add_" + product.getId(), "Added: " + product.getName());
        
        // Prepare response
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Product added using DSA structures");
        response.put("productId", product.getId());
        response.put("dsaOperations", new String[]{
            "Stack.push() - O(1)",
            "Queue.enqueue() - O(1)",
            "PriorityQueue.insert() - O(log n)"
        });
        
        return response;
    }
    
    public Map<String, Object> simulateRemoveProduct(String productId) {
        System.out.println("\n[API] Removing product: " + productId);
        
        dsaOperations.removeProduct(productId);
        operationLog.put("remove_" + productId, "Removed product");
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Product removal simulated");
        response.put("operations", new String[]{
            "ArrayList.remove() - O(n)",
            "Stack traversal - O(n)",
            "Queue traversal - O(n)"
        });
        
        return response;
    }
    
    public Map<String, Object> simulateProcessExpired() {
        System.out.println("\n[API] Processing expired products");
        
        DSAOperations.Product processed = dsaOperations.processNextExpired();
        
        Map<String, Object> response = new HashMap<>();
        if (processed != null) {
            operationLog.put("process_expired", "Processed: " + processed.getName());
            
            response.put("status", "success");
            response.put("processed", processed.getName());
            response.put("operation", "Queue.dequeue() - O(1)");
            response.put("dsaStructure", "ExpiryQueue (FIFO)");
        } else {
            response.put("status", "empty");
            response.put("message", "No expired products");
        }
        
        return response;
    }
    
    public Map<String, Object> simulateGetUrgentProducts() {
        System.out.println("\n[API] Getting urgent products");
        
        DSAOperations.Product urgent = dsaOperations.getMostUrgentProduct();
        
        Map<String, Object> response = new HashMap<>();
        if (urgent != null) {
            response.put("status", "success");
            response.put("urgentProduct", urgent.getName());
            response.put("priority", urgent.getPriority());
            response.put("operation", "PriorityQueue.peek() - O(1)");
            response.put("dsaStructure", "PriorityExpiryQueue (Min-Heap)");
        } else {
            response.put("status", "empty");
            response.put("message", "No urgent products");
        }
        
        return response;
    }
    
    public Map<String, Object> simulateSortProducts(String sortBy) {
        System.out.println("\n[API] Sorting products by: " + sortBy);
        
        dsaOperations.demonstrateSorting();
        operationLog.put("sort", "Sorted by " + sortBy);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("sortBy", sortBy);
        
        switch (sortBy.toLowerCase()) {
            case "expiry":
                response.put("algorithm", "Quick Sort");
                response.put("time", "O(n log n) average");
                break;
            case "priority":
                response.put("algorithm", "Merge Sort");
                response.put("time", "O(n log n) guaranteed");
                break;
            case "quantity":
                response.put("algorithm", "Bubble Sort");
                response.put("time", "O(n²)");
                break;
            default:
                response.put("algorithm", "Java TimSort");
                response.put("time", "O(n log n)");
        }
        
        return response;
    }
    
    public Map<String, Object> simulateSearchProducts(String searchType, String query) {
        System.out.println("\n[API] Searching products: " + searchType + " = " + query);
        
        dsaOperations.demonstrateSearching();
        operationLog.put("search", searchType + ": " + query);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("searchType", searchType);
        response.put("query", query);
        
        switch (searchType.toLowerCase()) {
            case "id":
                response.put("algorithm", "Linear Search");
                response.put("time", "O(n)");
                break;
            case "name":
                response.put("algorithm", "Binary Search");
                response.put("time", "O(log n)");
                break;
            default:
                response.put("algorithm", "Linear Filter");
                response.put("time", "O(n)");
        }
        
        return response;
    }
    
    public Map<String, Object> simulateGetDashboardStats() {
        System.out.println("\n[API] Getting dashboard stats");
        
        Map<String, Object> stats = dsaOperations.getDashboardStats();
        operationLog.put("stats", "Dashboard generated");
        
        stats.put("dsaStructures", new String[]{
            "ArrayList", "Stack", "Queue", "PriorityQueue"
        });
        
        return stats;
    }
    
    public Map<String, Object> getOperationLog() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("totalOperations", operationLog.size());
        response.put("operations", operationLog);
        response.put("timestamp", System.currentTimeMillis());
        
        return response;
    }
    
    public void runCompleteSimulation() {
        System.out.println("\n=== Running Complete DSA Simulation ===");
        
        // Add sample products
        Map<String, Object> milk = new HashMap<>();
        milk.put("name", "Fresh Milk");
        milk.put("category", "Dairy");
        milk.put("quantity", "20");
        milk.put("price", "2.99");
        simulateAddProduct(milk);
        
        Map<String, Object> eggs = new HashMap<>();
        eggs.put("name", "Organic Eggs");
        eggs.put("category", "Dairy");
        eggs.put("quantity", "12");
        eggs.put("price", "4.50");
        simulateAddProduct(eggs);
        
        // Demonstrate operations
        simulateGetUrgentProducts();
        simulateSortProducts("expiry");
        simulateSearchProducts("name", "Milk");
        simulateProcessExpired();
        
        System.out.println("\n=== Simulation Complete ===");
    }
}