package com.expirysync.dsa;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ProductSorter {
    
    public List<Product> quickSortByExpiry(List<Product> products) {
        System.out.println("  Quick Sort by Expiry Date");
        
        if (products.size() <= 1) {
            return new ArrayList<>(products);
        }
        
        List<Product> sorted = new ArrayList<>(products);
        quickSort(sorted, 0, sorted.size() - 1);
        
        System.out.println("    Time: O(n log n) average");
        return sorted;
    }
    
    private void quickSort(List<Product> products, int low, int high) {
        if (low < high) {
            int pi = partition(products, low, high);
            quickSort(products, low, pi - 1);
            quickSort(products, pi + 1, high);
        }
    }
    
    private int partition(List<Product> products, int low, int high) {
        Product pivot = products.get(high);
        int i = low - 1;
        
        for (int j = low; j < high; j++) {
            if (products.get(j).getExpiryDate()
                .compareTo(pivot.getExpiryDate()) <= 0) {
                i++;
                Collections.swap(products, i, j);
            }
        }
        
        Collections.swap(products, i + 1, high);
        return i + 1;
    }
    
    public List<Product> mergeSortByPriority(List<Product> products) {
        System.out.println("  Merge Sort by Priority");
        
        if (products.size() <= 1) {
            return new ArrayList<>(products);
        }
        
        List<Product> sorted = new ArrayList<>(products);
        mergeSort(sorted, 0, sorted.size() - 1);
        
        System.out.println("    Time: O(n log n) guaranteed");
        return sorted;
    }
    
    private void mergeSort(List<Product> products, int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            mergeSort(products, left, mid);
            mergeSort(products, mid + 1, right);
            merge(products, left, mid, right);
        }
    }
    
    private void merge(List<Product> products, int left, int mid, int right) {
        List<Product> leftArr = new ArrayList<>(products.subList(left, mid + 1));
        List<Product> rightArr = new ArrayList<>(products.subList(mid + 1, right + 1));
        
        int i = 0, j = 0, k = left;
        
        while (i < leftArr.size() && j < rightArr.size()) {
            if (leftArr.get(i).getPriority() <= rightArr.get(j).getPriority()) {
                products.set(k++, leftArr.get(i++));
            } else {
                products.set(k++, rightArr.get(j++));
            }
        }
        
        while (i < leftArr.size()) {
            products.set(k++, leftArr.get(i++));
        }
        
        while (j < rightArr.size()) {
            products.set(k++, rightArr.get(j++));
        }
    }
    
    public List<Product> bubbleSortByQuantity(List<Product> products) {
        System.out.println("  Bubble Sort by Quantity");
        
        List<Product> sorted = new ArrayList<>(products);
        int n = sorted.size();
        boolean swapped;
        
        for (int i = 0; i < n - 1; i++) {
            swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (sorted.get(j).getQuantity() > sorted.get(j + 1).getQuantity()) {
                    Collections.swap(sorted, j, j + 1);
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
        
        System.out.println("    Time: O(n²) worst case");
        return sorted;
    }
    
    // Product class for sorting
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
            return name;
        }
    }
}