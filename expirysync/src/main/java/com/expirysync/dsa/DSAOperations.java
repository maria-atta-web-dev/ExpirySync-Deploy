package com.expirysync.dsa;

import java.time.LocalDate;
import java.util.*;

public class DSAOperations {
    // DSA Structures
    private InventoryStack recentProductsStack;
    private ExpiryQueue expiryProcessingQueue;
    private PriorityExpiryQueue urgentProductsQueue;
    private ProductSorter productSorter;
    private ProductSearch productSearch;
    
    // Main storage
    private List<Product> allProducts;
    
    public DSAOperations() {
        this.recentProductsStack = new InventoryStack(50);
        this.expiryProcessingQueue = new ExpiryQueue(100);
        this.urgentProductsQueue = new PriorityExpiryQueue(100);
        this.productSorter = new ProductSorter();
        this.productSearch = new ProductSearch();
        this.allProducts = new ArrayList<>();
        
        System.out.println("DSA Operations initialized with all structures");
    }
    
    public void addProduct(Product product) {
        System.out.println("\n[+] Adding product: " + product.getName());
        
        // Add to main storage
        allProducts.add(product);
        
        // Add to DSA structures
        InventoryStack.Product stackProduct = convertToStackProduct(product);
        recentProductsStack.push(stackProduct);
        
        ExpiryQueue.Product queueProduct = convertToQueueProduct(product);
        expiryProcessingQueue.enqueue(queueProduct);
        
        PriorityExpiryQueue.Product priorityProduct = convertToPriorityProduct(product);
        urgentProductsQueue.insert(priorityProduct);
        
        System.out.println("  ✓ Added to: ArrayList, Stack, Queue, PriorityQueue");
    }
    
    public void removeProduct(String productId) {
        System.out.println("\n[-] Removing product ID: " + productId);
        
        // Find and remove from main storage
        Product toRemove = null;
        for (Product p : allProducts) {
            if (p.getId().equals(productId)) {
                toRemove = p;
                break;
            }
        }
        
        if (toRemove != null) {
            allProducts.remove(toRemove);
            System.out.println("  ✓ Removed from ArrayList");
            
            // Note: In real implementation, would remove from all structures
            System.out.println("  ⓘ Stack/Queue/PriorityQueue would need updates");
        } else {
            System.out.println("  ✗ Product not found");
        }
    }
    
    public Product processNextExpired() {
        System.out.println("\n[→] Processing next expired product");
        
        ExpiryQueue.Product expired = expiryProcessingQueue.dequeue();
        if (expired != null) {
            Product result = new Product();
            result.setId(expired.getId());
            result.setName(expired.getName());
            result.setExpiryDate(expired.getExpiryDate());
            System.out.println("  ✓ Processed: " + expired.getName());
            return result;
        }
        
        System.out.println("  ⓘ No expired products in queue");
        return null;
    }
    
    public Product getMostUrgentProduct() {
        System.out.println("\n[!] Getting most urgent product");
        
        PriorityExpiryQueue.Product urgent = urgentProductsQueue.peekMostUrgent();
        if (urgent != null) {
            Product result = new Product();
            result.setId(urgent.getId());
            result.setName(urgent.getName());
            result.setPriority(urgent.getPriority());
            System.out.println("  ✓ Most urgent: " + urgent.getName());
            return result;
        }
        
        System.out.println("  ⓘ No urgent products");
        return null;
    }
    
    public void demonstrateSorting() {
        System.out.println("\n[↕] Demonstrating sorting algorithms");
        
        if (allProducts.isEmpty()) {
            System.out.println("  ⓘ No products to sort");
            return;
        }
        
        List<ProductSorter.Product> sortable = convertToSortableProducts();
        
        System.out.println("  1. Quick Sort by Expiry:");
        productSorter.quickSortByExpiry(sortable);
        
        System.out.println("  2. Merge Sort by Priority:");
        productSorter.mergeSortByPriority(sortable);
        
        System.out.println("  3. Bubble Sort by Quantity:");
        productSorter.bubbleSortByQuantity(sortable);
    }
    
    public void demonstrateSearching() {
        System.out.println("\n[?] Demonstrating searching algorithms");
        
        if (allProducts.isEmpty()) {
            System.out.println("  ⓘ No products to search");
            return;
        }
        
        List<ProductSearch.Product> searchable = convertToSearchableProducts();
        
        if (!searchable.isEmpty()) {
            System.out.println("  1. Linear Search by ID:");
            productSearch.linearSearchById(searchable, searchable.get(0).getId());
            
            System.out.println("  2. Binary Search by Name:");
            productSearch.binarySearchByName(searchable, searchable.get(0).getName());
        }
    }
    
    public Map<String, Object> getDashboardStats() {
        System.out.println("\n[📊] Generating dashboard statistics");
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", allProducts.size());
        stats.put("recentAdditions", recentProductsStack.size());
        stats.put("inQueue", expiryProcessingQueue.size());
        stats.put("urgentCount", urgentProductsQueue.size());
        stats.put("lowStock", countLowStock());
        stats.put("expiringSoon", countExpiringSoon());
        
        System.out.println("  ✓ Generated stats for dashboard");
        return stats;
    }
    
    // Helper methods
    private int countLowStock() {
        int count = 0;
        for (Product p : allProducts) {
            if (p.getQuantity() < 10) count++;
        }
        return count;
    }
    
    private int countExpiringSoon() {
        int count = 0;
        LocalDate weekLater = LocalDate.now().plusDays(7);
        for (Product p : allProducts) {
            if (p.getExpiryDate().isBefore(weekLater)) count++;
        }
        return count;
    }
    
    // Conversion methods
    private InventoryStack.Product convertToStackProduct(Product p) {
        InventoryStack.Product sp = new InventoryStack.Product();
        sp.setId(p.getId());
        sp.setName(p.getName());
        sp.setCategory(p.getCategory());
        sp.setQuantity(p.getQuantity());
        sp.setExpiryDate(p.getExpiryDate());
        sp.setPrice(p.getPrice());
        return sp;
    }
    
    private ExpiryQueue.Product convertToQueueProduct(Product p) {
        ExpiryQueue.Product qp = new ExpiryQueue.Product();
        qp.setId(p.getId());
        qp.setName(p.getName());
        qp.setCategory(p.getCategory());
        qp.setQuantity(p.getQuantity());
        qp.setExpiryDate(p.getExpiryDate());
        qp.setPrice(p.getPrice());
        return qp;
    }
    
    private PriorityExpiryQueue.Product convertToPriorityProduct(Product p) {
        PriorityExpiryQueue.Product pp = new PriorityExpiryQueue.Product();
        pp.setId(p.getId());
        pp.setName(p.getName());
        pp.setCategory(p.getCategory());
        pp.setQuantity(p.getQuantity());
        pp.setExpiryDate(p.getExpiryDate());
        pp.setPrice(p.getPrice());
        return pp;
    }
    
    private List<ProductSorter.Product> convertToSortableProducts() {
        List<ProductSorter.Product> result = new ArrayList<>();
        for (Product p : allProducts) {
            ProductSorter.Product sp = new ProductSorter.Product();
            sp.setId(p.getId());
            sp.setName(p.getName());
            sp.setCategory(p.getCategory());
            sp.setQuantity(p.getQuantity());
            sp.setExpiryDate(p.getExpiryDate());
            sp.setPrice(p.getPrice());
            result.add(sp);
        }
        return result;
    }
    
    private List<ProductSearch.Product> convertToSearchableProducts() {
        List<ProductSearch.Product> result = new ArrayList<>();
        for (Product p : allProducts) {
            ProductSearch.Product sp = new ProductSearch.Product();
            sp.setId(p.getId());
            sp.setName(p.getName());
            sp.setCategory(p.getCategory());
            sp.setQuantity(p.getQuantity());
            sp.setPrice(p.getPrice());
            result.add(sp);
        }
        return result;
    }
    
    // Product class
    public static class Product {
        private String id;
        private String name;
        private String category;
        private int quantity;
        private LocalDate expiryDate;
        private String status;
        private int priority;
        private double price;
        private String supplier;
        
        public Product() {
            this.id = "PROD_" + System.currentTimeMillis();
            this.expiryDate = LocalDate.now().plusDays(30);
            this.status = "Active";
            this.priority = 3;
        }
        
        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
        
        public LocalDate getExpiryDate() { return expiryDate; }
        public void setExpiryDate(LocalDate expiryDate) { 
            this.expiryDate = expiryDate; 
            updatePriority();
        }
        
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        
        public int getPriority() { return priority; }
        public void setPriority(int priority) { this.priority = priority; }
        
        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }
        
        public String getSupplier() { return supplier; }
        public void setSupplier(String supplier) { this.supplier = supplier; }
        
        private void updatePriority() {
            if (expiryDate == null) return;
            
            long days = java.time.temporal.ChronoUnit.DAYS.between(
                LocalDate.now(), expiryDate);
            
            if (days < 0) priority = 0;      // Expired
            else if (days <= 3) priority = 1; // Critical
            else if (days <= 7) priority = 2; // Urgent
            else priority = 3;                // Normal
        }
        
        @Override
        public String toString() {
            return name + " (" + category + ") - Qty: " + quantity + 
                   ", Expires: " + expiryDate;
        }
    }
}