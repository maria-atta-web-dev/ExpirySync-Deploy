package com.expirysync.dsa;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class ProductSearch {
    
    public Product linearSearchById(List<Product> products, String targetId) {
        System.out.println("  Linear Search for ID: " + targetId);
        
        for (int i = 0; i < products.size(); i++) {
            Product p = products.get(i);
            if (p.getId().equals(targetId)) {
                System.out.println("    Found at index " + i + ": " + p.getName());
                System.out.println("    Time: O(n), Comparisons: " + (i + 1));
                return p;
            }
        }
        
        System.out.println("    Not found");
        return null;
    }
    
    public Product binarySearchByName(List<Product> products, String targetName) {
        System.out.println("  Binary Search for: " + targetName);
        
        // First sort by name
        List<Product> sorted = new ArrayList<>(products);
        Collections.sort(sorted, Comparator.comparing(Product::getName));
        
        int left = 0, right = sorted.size() - 1;
        int comparisons = 0;
        
        while (left <= right) {
            comparisons++;
            int mid = left + (right - left) / 2;
            Product midProduct = sorted.get(mid);
            
            int result = midProduct.getName().compareToIgnoreCase(targetName);
            
            if (result == 0) {
                System.out.println("    Found at position " + mid);
                System.out.println("    Time: O(log n), Comparisons: " + comparisons);
                return midProduct;
            } else if (result < 0) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        System.out.println("    Not found");
        return null;
    }
    
    // Product class for search
    public static class Product {
        private String id;
        private String name;
        private String category;
        private int quantity;
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
        
        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }
        
        @Override
        public String toString() {
            return name;
        }
    }
}