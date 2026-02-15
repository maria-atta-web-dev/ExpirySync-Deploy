package com.expirysync.dsa;

import java.time.LocalDate;
import java.util.LinkedList;
import java.util.Queue;

public class ExpiryQueue {
    private Queue<Product> queue;
    private int capacity;
    
    public ExpiryQueue(int capacity) {
        this.queue = new LinkedList<>();
        this.capacity = capacity;
    }
    
    public void enqueue(Product product) {
        if (queue.size() >= capacity) {
            System.out.println("  Queue full, cannot enqueue");
            return;
        }
        queue.offer(product);
        System.out.println("  Enqueued: " + product.getName());
    }
    
    public Product dequeue() {
        if (isEmpty()) {
            System.out.println("  Queue empty");
            return null;
        }
        Product p = queue.poll();
        System.out.println("  Dequeued: " + (p != null ? p.getName() : "null"));
        return p;
    }
    
    public Product peek() {
        return queue.peek();
    }
    
    public boolean isEmpty() {
        return queue.isEmpty();
    }
    
    public int size() {
        return queue.size();
    }
    
    // Product class for queue
    public static class Product {
        private String id;
        private String name;
        private String category;
        private int quantity;
        private LocalDate expiryDate;
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
        
        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }
        
        @Override
        public String toString() {
            return name;
        }
    }
}