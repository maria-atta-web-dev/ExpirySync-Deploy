# ExpirySync — Complete Project Presentation

> **A Full-Stack DSA Educational Project**  
> Smart Inventory Expiry Management System Demonstrating Data Structures & Algorithms

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [Technical Architecture](#technical-architecture)
4. [Data Structures & Algorithms](#data-structures--algorithms)
5. [Frontend Components](#frontend-components)
6. [Backend Implementation](#backend-implementation)
7. [Features & Functionality](#features--functionality)
8. [API Documentation](#api-documentation)
9. [How to Run](#how-to-run)
10. [Code Walkthrough](#code-walkthrough)
11. [Performance Analysis](#performance-analysis)
12. [Educational Value](#educational-value)
13. [Future Enhancements](#future-enhancements)
14. [Conclusion](#conclusion)

---

## 📌 Executive Summary

**ExpirySync** is a comprehensive educational project that demonstrates the practical application of Data Structures and Algorithms (DSA) in a real-world inventory management system. The project combines a Java backend with a modern web frontend to create an interactive learning platform for understanding DSA concepts.

### Key Highlights

- ✅ **Full-Stack Application**: Java backend + HTML/CSS/JavaScript frontend
- ✅ **6 DSA Implementations**: Stack, Queue, Priority Queue, Sorting, Searching, Operations Manager
- ✅ **9 Interactive Pages**: Dashboard, Inventory, Alerts, DSA Demo, Chatbot, and more
- ✅ **10 REST API Endpoints**: Complete backend-frontend integration
- ✅ **No External Dependencies**: Uses Java built-in `HttpServer`, no database required
- ✅ **Educational Focus**: Perfect for learning DSA through practical implementation

---

## 🎯 Project Overview

### Purpose

ExpirySync serves dual purposes:
1. **Educational Platform**: Demonstrates how DSA concepts work in real-world applications
2. **Functional System**: Provides actual inventory management with expiry tracking

### Problem Statement

Managing perishable inventory requires:
- Quick access to recently added items (Stack - LIFO)
- Processing expired items in order (Queue - FIFO)
- Prioritizing urgent/critical items (Priority Queue - Min Heap)
- Efficient sorting and searching (Algorithms)

### Solution

A web-based system that:
- Visualizes DSA operations in real-time
- Provides interactive demos for learning
- Implements practical inventory management
- Shows time complexity analysis for each operation

---

## 🏗️ Technical Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│  (HTML/CSS/JavaScript - 9 Interactive Pages)                │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTP Requests
                 │ (localhost:8080)
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              JAVA BACKEND (HttpServer)                       │
│  ┌──────────────────────────────────────────────────┐      │
│  │  WebServer.java (Port 8080)                       │      │
│  │  - Static File Handler                            │      │
│  │  - API Request Handlers (10 endpoints)            │      │
│  └──────────────────────┬───────────────────────────┘      │
│                         │                                    │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────┐      │
│  │  DSASimulator.java                                │      │
│  │  - Business Logic Layer                           │      │
│  │  - Operation Logging                              │      │
│  └──────────────────────┬───────────────────────────┘      │
│                         │                                    │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────┐      │
│  │  DSAOperations.java                               │      │
│  │  - Central DSA Management                         │      │
│  │  - Product Storage (ArrayList)                    │      │
│  └──────────────────────┬───────────────────────────┘      │
│                         │                                    │
│         ┌───────────────┴───────────────┐                   │
│         ▼               ▼               ▼                   │
│  ┌─────────────┐ ┌─────────────┐ ┌──────────────┐         │
│  │  Stack      │ │   Queue     │ │ Priority Q   │         │
│  │  (LIFO)     │ │   (FIFO)    │ │  (Min-Heap)  │         │
│  └─────────────┘ └─────────────┘ └──────────────┘         │
│                                                              │
│  ┌─────────────┐ ┌─────────────┐                           │
│  │  Sorting    │ │  Searching  │                           │
│  │  Algorithms │ │  Algorithms │                           │
│  └─────────────┘ └─────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Backend
- **Language**: Java 11+
- **Build Tool**: Maven
- **Web Server**: `com.sun.net.httpserver.HttpServer` (built-in)
- **JSON Processing**: Gson 2.8.9
- **Port**: 8080

#### Frontend
- **Structure**: HTML5
- **Styling**: CSS3 (Modern gradients, animations, responsive design)
- **Logic**: Vanilla JavaScript (ES6+)
- **Icons**: Font Awesome 6.0
- **Storage**: Browser LocalStorage

#### Development Tools
- **IDE**: VS Code (optional), IntelliJ, Eclipse
- **Version Control**: Git-compatible
- **No Database**: All data stored in memory/localStorage

---

## 🔬 Data Structures & Algorithms

### 1. Stack (LIFO) - InventoryStack.java

**Purpose**: Track recently added products

**Operations**:
- `push(Product)` - Add product to top - **O(1)**
- `pop()` - Remove from top - **O(1)**
- `peek()` - View top element - **O(1)**
- `size()` - Get stack size - **O(1)**

**Real-World Use**:
```text
Recent Products Display
┌─────────────────┐
│  Product C      │ ← Top (Most Recent)
├─────────────────┤
│  Product B      │
├─────────────────┤
│  Product A      │ ← Bottom (Oldest)
└─────────────────┘
```

**Implementation**: Array-based stack with fixed capacity (50 items)

---

### 2. Queue (FIFO) - ExpiryQueue.java

**Purpose**: Process expired products in order

**Operations**:
- `enqueue(Product)` - Add to rear - **O(1)**
- `dequeue()` - Remove from front - **O(1)**
- `peek()` - View front - **O(1)**
- `isEmpty()` - Check if empty - **O(1)**

**Real-World Use**:
```text
Expiry Processing Queue
FRONT →  [Product A] → [Product B] → [Product C] ← REAR
         (Expires    (Expires      (Expires
          Jan 1)      Jan 3)        Jan 5)
```

**Implementation**: Circular array-based queue (capacity 100)

---

### 3. Priority Queue (Min-Heap) - PriorityExpiryQueue.java

**Purpose**: Manage urgent products by priority

**Operations**:
- `insert(Product)` - Add with priority - **O(log n)**
- `remove()` - Remove highest priority - **O(log n)**
- `peekMostUrgent()` - View highest priority - **O(1)**

**Priority Levels**:
```text
Priority 0: Expired (already past expiry)
Priority 1: Critical (expires in ≤3 days)
Priority 2: Urgent (expires in ≤7 days)
Priority 3: Normal (expires in >7 days)
```

**Min-Heap Structure**:
```text
        [Priority 1]
       /            \
  [Priority 2]   [Priority 2]
    /       \
[Priority 3] [Priority 3]
```

**Implementation**: Binary min-heap with array representation

---

### 4. Sorting Algorithms - ProductSorter.java

#### Quick Sort
- **Best/Avg**: O(n log n)
- **Worst**: O(n²)
- **Use**: Sort by expiry date

#### Merge Sort
- **Time**: O(n log n) guaranteed
- **Space**: O(n)
- **Use**: Sort by priority

#### Bubble Sort
- **Time**: O(n²)
- **Use**: Sort by quantity (educational demonstration)

---

### 5. Searching Algorithms - ProductSearch.java

#### Linear Search
- **Time**: O(n)
- **Space**: O(1)
- **Use**: Search by ID (unsorted data)

#### Binary Search
- **Time**: O(log n)
- **Space**: O(1)
- **Use**: Search by name (requires sorted data)

---

## 🖥️ Frontend Components

### Page Breakdown

#### 1. index.html (Landing Page)
- **Purpose**: Project introduction and feature showcase
- **Components**:
  - Hero section with animated gradient background
  - Features grid (6 feature cards)
  - DSA overview section
  - Interactive stack visualization demo
  - Call-to-action sections
  - Footer with navigation links
- **CSS**: Modern gradients, glassmorphism, smooth animations
- **Size**: 899 lines, 31KB

#### 2. dashboard.html
- **Purpose**: Main control center
- **Components**:
  - Statistics cards (Total Products, Expiring Soon, Low Stock, etc.)
  - Charts and analytics
  - Recent activity feed
  - Quick action buttons
- **Features**: Real-time data updates, responsive design
- **Size**: 76KB

#### 3. dsa-demo.html
- **Purpose**: Interactive DSA demonstrations
- **Components**:
  - Stack visualization with push/pop/peek controls
  - Queue visualization with enqueue/dequeue
  - Priority Queue with min-heap display
  - Sorting algorithm comparisons
  - Searching algorithm demos
  - Time complexity analysis tables
  - Real-time operation logs
- **Features**: Live visualizations, complexity badges, code explanations
- **Size**: 875 lines, 40KB

#### 4. inventory.html
- **Purpose**: Product inventory management
- **Components**:
  - Product list table
  - Filter and search functionality
  - Bulk actions
  - Export capabilities
- **Size**: 43KB

#### 5. add-product.html
- **Purpose**: Add new products to inventory
- **Components**:
  - Product details form
  - Expiry date picker
  - Category selection
  - Quantity input
  - Form validation
- **Size**: 27KB

#### 6. alerts.html
- **Purpose**: Smart alert system
- **Components**:
  - Priority-based alerts
  - Expiry notifications
  - Low stock warnings
  - Alert filtering
- **Size**: 37KB

#### 7. chatbot.html
- **Purpose**: AI assistant for DSA concepts
- **Components**:
  - Interactive chat interface
  - DSA concept explanations
  - Inventory queries
  - Predefined quick responses
- **Size**: 131KB

#### 8. login.html
- **Purpose**: User authentication
- **Components**:
  - Login form
  - Animated background
  - Form validation
- **Size**: 79KB

#### 9. settings.html
- **Purpose**: Application configuration
- **Components**:
  - User preferences
  - Display settings
  - Data management

---

## ⚙️ Backend Implementation

### File Structure

```
src/main/java/com/expirysync/
├── Main.java                    (Entry point - 28 lines)
├── api/
│   ├── WebServer.java           (HTTP server - 352 lines)
│   └── DSASimulator.java        (Business logic - 237 lines)
└── dsa/
    ├── DSAOperations.java       (Central manager - 307 lines)
    ├── InventoryStack.java      (Stack impl - 2.8KB)
    ├── ExpiryQueue.java         (Queue impl - 2.4KB)
    ├── PriorityExpiryQueue.java (Priority Queue - 3.5KB)
    ├── ProductSorter.java       (Sorting algos - 5.2KB)
    └── ProductSearch.java       (Search algos - 3.0KB)
```

### Core Components

#### Main.java
```java
public class Main {
    public static void main(String[] args) {
        // Entry point - starts WebServer
        WebServer.startServer();
    }
}
```

#### WebServer.java
**Responsibilities**:
1. Start HTTP server on port 8080
2. Serve static files from `webapp/` directory
3. Handle 10 API endpoints
4. JSON request/response processing
5. Error handling and logging

**Key Handlers**:
- `StaticFileHandler` - Serves HTML/CSS/JS files
- `HealthHandler` - Health check endpoint
- `AddProductHandler` - Process new products
- `RemoveProductHandler` - Delete products
- `ProcessExpiredHandler` - Handle expired items
- `GetUrgentHandler` - Retrieve urgent products
- `SortProductsHandler` - Sort operations
- `SearchProductsHandler` - Search operations
- `DashboardStatsHandler` - Dashboard statistics
- `OperationLogHandler` - Operation logs
- `SimulationHandler` - Run complete simulation

#### DSASimulator.java
**Responsibilities**:
1. Coordinate DSA operations
2. Maintain operation logs
3. Simulate product workflows
4. Generate statistics

**Key Methods**:
- `simulateAddProduct(Map<String, Object>)` - Add product with DSA operations
- `simulateRemoveProduct(String)` - Remove with cleanup
- `simulateProcessExpired()` - Process expired queue
- `simulateGetUrgentProducts()` - Priority queue operations
- `simulateSortProducts(String)` - Sorting demonstrations
- `simulateSearchProducts(String, String)` - Search demonstrations
- `simulateGetDashboardStats()` - Statistics generation
- `runCompleteSimulation()` - Full system demo

#### DSAOperations.java
**Central DSA Manager**:
```java
public class DSAOperations {
    private InventoryStack recentProductsStack;
    private ExpiryQueue expiryProcessingQueue;
    private PriorityExpiryQueue urgentProductsQueue;
    private ProductSorter productSorter;
    private ProductSearch productSearch;
    private List<Product> allProducts;
    
    // Manages all DSA structures
    // Coordinates operations across structures
    // Handles product lifecycle
}
```

---

## ✨ Features & Functionality

### Feature Matrix

| Feature | Description | DSA Used | Complexity |
|---------|-------------|----------|------------|
| **Add Product** | Add new inventory item | Stack, Queue, Priority Queue | O(log n) |
| **Remove Product** | Delete inventory item | ArrayList removal | O(n) |
| **Process Expired** | Handle expired products | Queue dequeue | O(1) |
| **Get Urgent** | Find highest priority | Priority Queue peek | O(1) |
| **Sort Inventory** | Sort by various criteria | Quick/Merge/Bubble Sort | O(n log n) |
| **Search Product** | Find specific items | Linear/Binary Search | O(log n) |
| **Dashboard Stats** | Generate statistics | Aggregate operations | O(n) |
| **Recent Products** | View latest additions | Stack peek | O(1) |
| **Alert System** | Priority-based alerts | Priority Queue | O(log n) |
| **DSA Visualization** | Interactive demos | All structures | Varies |

### Workflow Examples

#### Adding a Product
```text
1. User fills form on add-product.html
2. JavaScript sends POST to /api/addProduct
3. WebServer.AddProductHandler receives request
4. DSASimulator.simulateAddProduct() processes
5. DSAOperations performs:
   - Add to allProducts (ArrayList)
   - Push to recentProductsStack
   - Enqueue to expiryProcessingQueue
   - Insert to urgentProductsQueue (with priority)
6. Response sent back to frontend
7. UI updates with success message
```

#### Processing Expired Products
```text
1. User clicks "Process Expired" button
2. POST request to /api/processExpired
3. DSASimulator.simulateProcessExpired()
4. ExpiryQueue.dequeue() - FIFO order
5. Apply business logic (discounts, removal)
6. Log operation
7. Return processed products list
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Endpoints

#### 1. Health Check
```http
GET /api/health
```
**Response**:
```json
{
  "status": "OK",
  "timestamp": "2026-01-01T15:30:00",
  "message": "ExpirySync API is running"
}
```

#### 2. Dashboard Statistics
```http
GET /api/dashboardStats
```
**Response**:
```json
{
  "totalProducts": 25,
  "recentAdditions": 5,
  "inQueue": 12,
  "urgentCount": 3,
  "lowStock": 4,
  "expiringSoon": 7
}
```

#### 3. Add Product
```http
POST /api/addProduct
Content-Type: application/json

{
  "name": "Milk",
  "category": "Dairy",
  "quantity": 50,
  "expiryDate": "2026-01-15",
  "price": 3.99,
  "supplier": "FreshFarm"
}
```

#### 4. Remove Product
```http
DELETE /api/removeProduct?id=PROD_123456789
```

#### 5. Process Expired
```http
POST /api/processExpired
```
**Response**: List of processed expired products

#### 6. Get Urgent Products
```http
GET /api/getUrgent
```
**Response**: Products sorted by urgency (priority queue)

#### 7. Sort Products
```http
POST /api/sortProducts?by=expiry
```
**Parameters**: `by` = expiry | priority | quantity | name

#### 8. Search Products
```http
POST /api/searchProducts
Content-Type: application/json

{
  "searchType": "id",
  "query": "PROD_123"
}
```

#### 9. Operation Log
```http
GET /api/operationLog
```
**Response**: Recent operations log

#### 10. Run Simulation
```http
GET /api/simulate
```
**Response**: Complete simulation results

---

## 🚀 How to Run

### Prerequisites

✅ **Java 11 or higher**
```bash
java -version
# Should show: java version "11.0.x" or higher
```

✅ **Apache Maven**
```bash
mvn -version
# Should show: Apache Maven 3.x.x
```

### Running the Application

#### Method 1: Maven exec (Recommended)

**Command Prompt (Windows)**:
```bash
cd C:\Users\DELL\Desktop\expirysync
mvn clean compile exec:java -Dexec.mainClass="com.expirysync.Main"
```

**PowerShell**:
```powershell
cd C:\Users\DELL\Desktop\expirysync
mvn --% clean compile exec:java -Dexec.mainClass=com.expirysync.Main
```

#### Method 2: IDE
1. Open project in IntelliJ IDEA / Eclipse / VS Code
2. Import as Maven project
3. Run `Main.java`

#### Method 3: JAR (future)
```bash
mvn clean package
java -jar target/expirysync-1.0.0.jar
```

### Accessing the Application

Once started, you'll see:
```
==========================================
=== ExpirySync Server Started Successfully! ===
==========================================
Frontend URL: http://localhost:8080
API Base URL: http://localhost:8080/api

Available Pages:
  • http://localhost:8080/index.html
  • http://localhost:8080/dsa-demo.html
  • http://localhost:8080/dashboard.html
  
Server is running...
==========================================
```

**Open in browser**: http://localhost:8080

---

## 📚 Code Walkthrough

### Product Class (DSAOperations.Product)

```java
public static class Product {
    private String id;           // Auto-generated: PROD_timestamp
    private String name;         // Product name
    private String category;     // Category
    private int quantity;        // Stock quantity
    private LocalDate expiryDate; // Expiry date
    private String status;       // Active/Expired/Warning
    private int priority;        // 0-3 (auto-calculated)
    private double price;        // Price
    private String supplier;     // Supplier name
    
    // Auto-calculates priority based on days until expiry:
    // 0 = Expired (past date)
    // 1 = Critical (≤3 days)
    // 2 = Urgent (≤7 days)
    // 3 = Normal (>7 days)
    private void updatePriority() { ... }
}
```

### Stack Implementation Snippet

```java
public class InventoryStack {
    private Product[] items;
    private int top = -1;
    private int maxSize;
    
    public void push(Product product) {
        if (top < maxSize - 1) {
            items[++top] = product;
        }
    }
    
    public Product pop() {
        if (top >= 0) {
            return items[top--];
        }
        return null;
    }
}
```

### Priority Queue Heapify

```java
private void heapifyUp(int index) {
    int parent = (index - 1) / 2;
    if (index > 0 && heap[index].getPriority() < heap[parent].getPriority()) {
        swap(index, parent);
        heapifyUp(parent);
    }
}
```

---

## ⚡ Performance Analysis

### Time Complexity Summary

| Operation | Data Structure | Best Case | Average | Worst Case |
|-----------|---------------|-----------|---------|------------|
| Add Product | Stack | O(1) | O(1) | O(1) |
| Add Product | Queue | O(1) | O(1) | O(1) |
| Add Product | Priority Queue | O(1) | O(log n) | O(log n) |
| Remove Top | Stack | O(1) | O(1) | O(1) |
| Dequeue | Queue | O(1) | O(1) | O(1) |
| Remove Urgent | Priority Queue | O(log n) | O(log n) | O(log n) |
| Quick Sort | Sorting | O(n log n) | O(n log n) | O(n²) |
| Merge Sort | Sorting | O(n log n) | O(n log n) | O(n log n) |
| Bubble Sort | Sorting | O(n) | O(n²) | O(n²) |
| Linear Search | Search | O(1) | O(n) | O(n) |
| Binary Search | Search | O(1) | O(log n) | O(log n) |

### Space Complexity

- **Stack**: O(n) - Fixed array of 50 elements
- **Queue**: O(n) - Circular array of 100 elements
- **Priority Queue**: O(n) - Dynamic array
- **Sorting**: O(n) for merge sort, O(1) for quick/bubble
- **Searching**: O(1) for both algorithms

---

## 🎓 Educational Value

### Learning Outcomes

Students/Developers will learn:

1. **Data Structure Implementation**
   - How to implement Stack, Queue, Priority Queue from scratch
   - Understanding LIFO vs FIFO vs Priority-based access
   - Array-based vs linked implementations

2. **Algorithm Design**
   - Sorting algorithm comparison (Quick, Merge, Bubble)
   - Search algorithm efficiency (Linear vs Binary)
   - Time/Space complexity analysis

3. **Real-World Application**
   - Connecting theory to practice
   - When to use which data structure
   - Trade-offs between different approaches

4. **Full-Stack Development**
   - Java backend development
   - RESTful API design
   - Frontend-backend integration
   - HTTP request/response handling

5. **Software Engineering**
   - Project structure and organization
   - Maven build system
   - Code modularity and separation of concerns

---

## 🔮 Future Enhancements

### Planned Improvements

1. **Executable JAR**
   - Add maven-shade plugin
   - Create standalone JAR file
   - Simplified deployment

2. **Testing**
   - Unit tests for DSA classes
   - Integration tests for API
   - Frontend testing with Selenium

3. **Logging**
   - Add SLF4J + Logback
   - Structured logging
   - Log rotation

4. **VS Code Integration**
   - Add `.vscode/launch.json`
   - Debug configurations
   - Task automation

5. **Database Integration** (optional)
   - Add H2/SQLite for persistence
   - Migration from LocalStorage
   - Data backup/restore

6. **Advanced Features**
   - Graph data structure for supplier relationships
   - Tree structure for category hierarchy
   - Hash table for fast product lookup
   - Advanced analytics with charts

7. **Production Readiness**
   - HTTPS support
   - Authentication & Authorization
   - Input validation
   - Rate limiting
   - Error handling improvements

---

## 🎯 Conclusion

### Project Summary

ExpirySync successfully demonstrates:
- ✅ **6 Major DSA implementations** in Java
- ✅ **Real-world practical application** of theoretical concepts
- ✅ **Complete full-stack system** with 9 interactive pages
- ✅ **RESTful API** with 10 endpoints
- ✅ **Interactive visualizations** for learning
- ✅ **Clean, modular architecture** with separation of concerns

### Key Achievements

1. **Educational Excellence**: Bridges gap between DSA theory and practice
2. **Production-Quality Code**: Well-structured, documented, maintainable
3. **User Experience**: Modern UI with smooth animations and interactions
4. **Performance**: Efficient algorithms with clear complexity analysis
5. **Accessibility**: No complex setup, runs immediately

### Target Audience

- 🎓 **Students**: Learning DSA concepts
- 👨‍💻 **Developers**: Understanding practical DSA applications
- 👨‍🏫 **Educators**: Teaching tool for DSA courses
- 📚 **Self-learners**: Hands-on DSA practice

---

## 📞 Getting Started

1. **Clone/Download** the project
2. **Ensure Java 11+ and Maven** are installed
3. **Run**: `mvn clean compile exec:java -Dexec.mainClass="com.expirysync.Main"`
4. **Open**: http://localhost:8080
5. **Explore**: Start with the DSA Demo page to see visualizations

---

## 📄 License & Usage

This project is created for **educational purposes**. Feel free to:
- Study the code
- Learn from the implementations
- Use as a reference for your projects
- Modify and extend

---

**Built with ❤️ for learning Data Structures & Algorithms**

*Last Updated: January 1, 2026*