package com.expirysync.dsa;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.PriorityQueue;

public class PriorityExpiryQueue {
    private PriorityQueue<Product> priorityQueue;
    private int capacity;
    
    public PriorityExpiryQueue(int capacity) {
        // Min-heap based on priority (lower number = higher priority)
        this.priorityQueue = new PriorityQueue<>(Comparator.comparingInt(Product::getPriority));
        this.capacity = capacity;
    }
    
    public void insert(Product product) {
        if (priorityQueue.size() >= capacity) {
            System.out.println("  Priority queue full");
            return;
        }
        
        // Calculate priority based on expiry
        int priority = calculatePriority(product.getExpiryDate());
        product.setPriority(priority);
        
        priorityQueue.offer(product);
        System.out.println("  Inserted to priority queue: " + product.getName() + 
                          " (Priority: " + priority + ")");
    }
    
    public Product removeMostUrgent() {
        if (isEmpty()) {
            System.out.println("  Priority queue empty");
            return null;
        }
        Product p = priorityQueue.poll();
        System.out.println("  Removed most urgent: " + p.getName());
        return p;
    }
    
    public Product peekMostUrgent() {
        return priorityQueue.peek();
    }
    
    public boolean isEmpty() {
        return priorityQueue.isEmpty();
    }
    
    public int size() {
        return priorityQueue.size();
    }
    
    private int calculatePriority(LocalDate expiryDate) {
        if (expiryDate == null) return 3;
        
        long days = java.time.temporal.ChronoUnit.DAYS.between(
            LocalDate.now(), expiryDate);
        
        if (days < 0) return 0;      // Expired
        if (days <= 3) return 1;     // Critical
        if (days <= 7) return 2;     // Urgent
        return 3;                    // Normal
    }
    
    // Product class for priority queue
    public static class Product {
        private String id;
        private String name;
        private String category;
        private int quantity;
        private LocalDate expiryDate;
        private int priority;
        private double price;
        
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
        public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
        
        public int getPriority() { return priority; }
        public void setPriority(int priority) { this.priority = priority; }
        
        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }
        
        @Override
        public String toString() {
            return name + " (P:" + priority + ")";
        }
    }
}