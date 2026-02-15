package com.expirysync;

import com.expirysync.api.WebServer;

public class Main {
    public static void main(String[] args) {
        System.out.println("==========================================");
        System.out.println("=== ExpirySync Inventory Management ===");
        System.out.println("===      DSA Implementation          ===");
        System.out.println("==========================================");
        
        try {
            // Start the web server
            System.out.println("\nStarting web server on port 8080...");
            WebServer.startServer();
            
        } catch (Exception e) {
            System.err.println("\n Failed to start server: " + e.getMessage());
            System.err.println("\nTroubleshooting tips:");
            System.err.println("1. Check if port 8080 is already in use");
            System.err.println("2. Ensure all dependencies are installed");
            System.err.println("3. Run 'mvn clean compile' before running");
            System.err.println("\nError details:");
            e.printStackTrace();
            System.exit(1);
        }
    }
}