package com.expirysync.api;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
public class WebServer {
    private static final Gson gson = new Gson();
    private static DSASimulator dsaSimulator;
    
    private static int getPort() {
        String envPort = System.getenv("PORT");
        if (envPort != null && !envPort.isEmpty()) {
            try {
                return Integer.parseInt(envPort);
            } catch (NumberFormatException e) {
                System.err.println("Invalid PORT environment variable, using default 8080");
            }
        }
        return 8080;
    }
    
    public static void startServer() throws IOException {
        int port = getPort();
        dsaSimulator = new DSASimulator();
        
        com.sun.net.httpserver.HttpServer server = com.sun.net.httpserver.HttpServer.create(
            new InetSocketAddress(port), 0);
        
        // Serve static files
        server.createContext("/", new StaticFileHandler());
        
        // API endpoints
        server.createContext("/api/addProduct", new AddProductHandler());
        server.createContext("/api/removeProduct", new RemoveProductHandler());
        server.createContext("/api/processExpired", new ProcessExpiredHandler());
        server.createContext("/api/getUrgent", new GetUrgentHandler());
        server.createContext("/api/sortProducts", new SortProductsHandler());
        server.createContext("/api/searchProducts", new SearchProductsHandler());
        server.createContext("/api/dashboardStats", new DashboardStatsHandler());
        server.createContext("/api/operationLog", new OperationLogHandler());
        server.createContext("/api/simulate", new SimulationHandler());
        
        // Health check endpoint
        server.createContext("/api/health", new HealthHandler());
        
        server.setExecutor(null);
        server.start();
        
        System.out.println("\n" + "=".repeat(50));
        System.out.println("=== ExpirySync Server Started Successfully! ===");
        System.out.println("=".repeat(50));
        System.out.println("Frontend URL: http://localhost:" + PORT);
        System.out.println("API Base URL: http://localhost:" + PORT + "/api");
        System.out.println("\nAvailable Pages:");
        System.out.println("  • http://localhost:" + PORT + "/index.html");
        System.out.println("  • http://localhost:" + PORT + "/dsa-demo.html");
        System.out.println("  • http://localhost:" + PORT + "/dashboard.html");
        System.out.println("\nServer is running...");
        System.out.println("=".repeat(50) + "\n");
    }
    
    // ==================== Static File Handler ====================
    static class StaticFileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            
            if (path.equals("/")) {
                path = "/index.html";
            }
            
            try {
                // Try to load from classpath
                String resourcePath = "webapp" + path;
                InputStream is = getClass().getClassLoader().getResourceAsStream(resourcePath);
                
                if (is == null) {
                    // Try from file system (development)
                    Path filePath = Paths.get("src/main/resources/" + resourcePath);
                    if (Files.exists(filePath)) {
                        is = Files.newInputStream(filePath);
                    } else {
                        // Try from compiled resources
                        filePath = Paths.get("target/classes/" + resourcePath);
                        if (Files.exists(filePath)) {
                            is = Files.newInputStream(filePath);
                        } else {
                            send404(exchange, "File not found: " + path);
                            return;
                        }
                    }
                }
                
                // Set content type
                String contentType = getContentType(path);
                exchange.getResponseHeaders().set("Content-Type", contentType);
                exchange.getResponseHeaders().set("Cache-Control", "no-cache");
                exchange.sendResponseHeaders(200, 0);
                
                // Send file
                OutputStream os = exchange.getResponseBody();
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = is.read(buffer)) != -1) {
                    os.write(buffer, 0, bytesRead);
                }
                
                os.close();
                is.close();
                
            } catch (Exception e) {
                System.err.println("Error serving " + path + ": " + e.getMessage());
                send404(exchange, "Error: " + e.getMessage());
            }
        }
        
        private String getContentType(String path) {
            if (path.endsWith(".css")) return "text/css";
            if (path.endsWith(".js")) return "application/javascript";
            if (path.endsWith(".json")) return "application/json";
            if (path.endsWith(".png")) return "image/png";
            if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
            if (path.endsWith(".gif")) return "image/gif";
            if (path.endsWith(".ico")) return "image/x-icon";
            return "text/html";
        }
        
        private void send404(HttpExchange exchange, String message) throws IOException {
            String response = "<html><body><h1>404 Not Found</h1><p>" + message + "</p></body></html>";
            exchange.getResponseHeaders().set("Content-Type", "text/html");
            exchange.sendResponseHeaders(404, response.length());
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }
    }
    
    // ==================== API Handlers ====================
    
    static class HealthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "healthy");
            response.put("service", "ExpirySync DSA Backend");
            response.put("timestamp", System.currentTimeMillis());
            sendJsonResponse(exchange, response);
        }
    }
    
    static class AddProductHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equals(exchange.getRequestMethod())) {
                sendError(exchange, "Method not allowed", 405);
                return;
            }
            
            try {
                String body = readRequestBody(exchange);
                System.out.println("Add Product Request: " + body);
                
                @SuppressWarnings("unchecked")
                Map<String, Object> productData = gson.fromJson(body, Map.class);
                Map<String, Object> response = dsaSimulator.simulateAddProduct(productData);
                sendJsonResponse(exchange, response);
                
            } catch (Exception e) {
                sendError(exchange, "Error: " + e.getMessage(), 500);
            }
        }
    }
    
    static class RemoveProductHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"DELETE".equals(exchange.getRequestMethod())) {
                sendError(exchange, "Method not allowed", 405);
                return;
            }
            
            String query = exchange.getRequestURI().getQuery();
            if (query == null || !query.startsWith("id=")) {
                sendError(exchange, "Missing product ID", 400);
                return;
            }
            
            String productId = query.substring(3);
            System.out.println("Remove Product Request for ID: " + productId);
            
            Map<String, Object> response = dsaSimulator.simulateRemoveProduct(productId);
            sendJsonResponse(exchange, response);
        }
    }
    
    static class ProcessExpiredHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equals(exchange.getRequestMethod())) {
                sendError(exchange, "Method not allowed", 405);
                return;
            }
            
            System.out.println("Process Expired Request");
            Map<String, Object> response = dsaSimulator.simulateProcessExpired();
            sendJsonResponse(exchange, response);
        }
    }
    
    static class GetUrgentHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equals(exchange.getRequestMethod())) {
                sendError(exchange, "Method not allowed", 405);
                return;
            }
            
            System.out.println("Get Urgent Products Request");
            Map<String, Object> response = dsaSimulator.simulateGetUrgentProducts();
            sendJsonResponse(exchange, response);
        }
    }
    
    static class SortProductsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equals(exchange.getRequestMethod())) {
                sendError(exchange, "Method not allowed", 405);
                return;
            }
            
            String query = exchange.getRequestURI().getQuery();
            if (query == null || !query.startsWith("by=")) {
                sendError(exchange, "Missing sort criteria", 400);
                return;
            }
            
            String sortBy = query.substring(3);
            System.out.println("Sort Products Request by: " + sortBy);
            
            Map<String, Object> response = dsaSimulator.simulateSortProducts(sortBy);
            sendJsonResponse(exchange, response);
        }
    }
    
    static class SearchProductsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equals(exchange.getRequestMethod())) {
                sendError(exchange, "Method not allowed", 405);
                return;
            }
            
            try {
                String body = readRequestBody(exchange);
                System.out.println("Search Products Request: " + body);
                
                JsonObject json = gson.fromJson(body, JsonObject.class);
                String searchType = json.get("searchType").getAsString();
                String query = json.get("query").getAsString();
                
                Map<String, Object> response = dsaSimulator.simulateSearchProducts(searchType, query);
                sendJsonResponse(exchange, response);
                
            } catch (Exception e) {
                sendError(exchange, "Invalid request: " + e.getMessage(), 400);
            }
        }
    }
    
    static class DashboardStatsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equals(exchange.getRequestMethod())) {
                sendError(exchange, "Method not allowed", 405);
                return;
            }
            
            System.out.println("Dashboard Stats Request");
            Map<String, Object> response = dsaSimulator.simulateGetDashboardStats();
            sendJsonResponse(exchange, response);
        }
    }
    
    static class OperationLogHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equals(exchange.getRequestMethod())) {
                sendError(exchange, "Method not allowed", 405);
                return;
            }
            
            System.out.println("Operation Log Request");
            Map<String, Object> response = dsaSimulator.getOperationLog();
            sendJsonResponse(exchange, response);
        }
    }
    
    static class SimulationHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equals(exchange.getRequestMethod())) {
                sendError(exchange, "Method not allowed", 405);
                return;
            }
            
            System.out.println("Run Simulation Request");
            dsaSimulator.runCompleteSimulation();
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Simulation completed");
            sendJsonResponse(exchange, response);
        }
    }
    
    // ==================== Utility Methods ====================
    
    private static String readRequestBody(HttpExchange exchange) throws IOException {
        InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), "utf-8");
        BufferedReader br = new BufferedReader(isr);
        StringBuilder body = new StringBuilder();
        String line;
        while ((line = br.readLine()) != null) {
            body.append(line);
        }
        return body.toString();
    }
    
    private static void sendJsonResponse(HttpExchange exchange, Map<String, Object> response) throws IOException {
        String json = gson.toJson(response);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.sendResponseHeaders(200, json.getBytes().length);
        
        OutputStream os = exchange.getResponseBody();
        os.write(json.getBytes());
        os.close();
    }
    
    private static void sendError(HttpExchange exchange, String message, int code) throws IOException {
        Map<String, Object> error = new HashMap<>();
        error.put("error", message);
        error.put("code", code);
        
        String json = gson.toJson(error);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(code, json.getBytes().length);
        
        OutputStream os = exchange.getResponseBody();
        os.write(json.getBytes());
        os.close();
    }
}