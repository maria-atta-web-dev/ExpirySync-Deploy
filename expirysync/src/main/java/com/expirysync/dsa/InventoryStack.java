package com.expirysync.dsa;

import java.time.LocalDate;
import java.util.Stack;

public class InventoryStack {
    private Stack<Product> stack;
    private int capacity;
    
    public InventoryStack(int capacity) {
        this.stack = new Stack<>();
        this.capacity = capacity;
    }
    
    public void push(Product product) {
        if (stack.size() >= capacity) {
            System.out.println("  Stack full, removing oldest");
            removeOldest();
        }
        stack.push(product);
        System.out.println("  Pushed to stack: " + product.getName());
    }
    
    public Product pop() {
        if (isEmpty()) {
            System.out.println("  Stack empty");
            return null;
        }
        Product p = stack.pop();
        System.out.println("  Popped from stack: " + p.getName());
        return p;
    }
    
    public Product peek() {
        if (isEmpty()) return null;
        return stack.peek();
    }
    
    public boolean isEmpty() {
        return stack.isEmpty();
    }
    
    public int size() {
        return stack.size();
    }
    
    private void removeOldest() {
        if (!stack.isEmpty()) {
            Stack<Product> temp = new Stack<>();
            while (stack.size() > 1) {
                temp.push(stack.pop());
            }
            Product removed = stack.pop();
            System.out.println("  Removed oldest: " + removed.getName());
            
            while (!temp.isEmpty()) {
                stack.push(temp.pop());
            }
        }
    }
    
    // Product class for stack
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