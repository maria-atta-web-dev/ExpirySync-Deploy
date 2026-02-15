# ExpirySync - How to Run the Project

## 📋 Overview
ExpirySync is a Java-based inventory management system with a web-based frontend. The backend is built with Java and uses Maven, while the frontend consists of HTML, CSS, and JavaScript files that are served by the Java backend server.

## 🏗️ Project Architecture

### Backend
- **Language**: Java 11
- **Build Tool**: Maven
- **Web Server**: Java's built-in `com.sun.net.httpserver.HttpServer`
- **Port**: 8080
- **Main Class**: `com.expirysync.Main`

### Frontend
- **Location**: `src/main/resources/webapp/`
- **Files**: HTML, CSS, JavaScript
- **Served by**: Java backend (automatically)

### How They Connect
The Java backend serves both:
1. **Static Files** (HTML/CSS/JS) via the root path `/`
2. **REST API** via `/api/*` endpoints

When you run the Java application:
- It starts a web server on port 8080
- Automatically serves all frontend files from `src/main/resources/webapp/`
- Exposes API endpoints for frontend to communicate with backend

## ✅ Prerequisites

1. **Java Development Kit (JDK) 11 or higher**
   - Check if installed: `java -version`
   - Download from: https://adoptium.net/

2. **Apache Maven**
   - Check if installed: `mvn -version`
   - Download from: https://maven.apache.org/download.cgi

## 🚀 Running the Project

### Method 1: Using Maven (Recommended)

Open PowerShell or Command Prompt and navigate to the project directory:

```powershell
# 1. Navigate to your project
cd C:\Users\DELL\Desktop\expirysync

# 2. Clean previous builds
mvn clean

# 3. Compile the project
mvn compile

# 4. Run the application
mvn exec:java "-Dexec.mainClass=com.expirysync.Main"
```

### Method 2: Using Compiled JAR

```powershell
# 1. Navigate to your project
cd C:\Users\DELL\Desktop\expirysync

# 2. Build the JAR file
mvn clean package

# 3. Run the JAR
java -jar target/expirysync-1.0.0.jar
```

### Method 3: Using Your IDE

If using IntelliJ IDEA, Eclipse, or VS Code:
1. Open the project folder
2. Let the IDE import Maven dependencies
3. Run the `Main.java` class directly

## 🌐 Accessing the Application

Once the server starts, you'll see output like:

```
==================================================
=== ExpirySync Server Started Successfully! ===
==================================================
Frontend URL: http://localhost:8080
API Base URL: http://localhost:8080/api

Available Pages:
  • http://localhost:8080/index.html
  • http://localhost:8080/dsa-demo.html
  • http://localhost:8080/dashboard.html

Server is running...
==================================================
```

### Open in Browser

Simply open your web browser and go to:
- **Main Page**: http://localhost:8080
- **Index**: http://localhost:8080/index.html
- **DSA Demo**: http://localhost:8080/dsa-demo.html
- **Dashboard**: http://localhost:8080/dashboard.html
- **Login**: http://localhost:8080/login.html
- **Inventory**: http://localhost:8080/inventory.html
- **Add Product**: http://localhost:8080/add-product.html
- **Alerts**: http://localhost:8080/alerts.html
- **Settings**: http://localhost:8080/settings.html
- **Chatbot**: http://localhost:8080/chatbot.html

## 🔌 API Endpoints

The frontend communicates with these backend endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/dashboardStats` | GET | Get dashboard statistics |
| `/api/operationLog` | GET | Get operation logs |
| `/api/addProduct` | POST | Add a new product |
| `/api/removeProduct` | DELETE | Remove a product |
| `/api/processExpired` | POST | Process expired products |
| `/api/getUrgent` | GET | Get urgent products |
| `/api/sortProducts` | POST | Sort products |
| `/api/searchProducts` | POST | Search products |
| `/api/simulate` | GET | Run simulation |

## 🛠️ Troubleshooting

### Port 8080 Already in Use
If you get an error that port 8080 is already in use:

1. **Find the process using port 8080:**
   ```powershell
   netstat -ano | findstr :8080
   ```

2. **Kill the process:**
   ```powershell
   taskkill /PID <process_id> /F
   ```

3. Or change the port in `WebServer.java` (line 17)

### Maven Dependencies Not Found
```powershell
mvn clean install -U
```

### Frontend Not Loading
1. Make sure the server is running (check console output)
2. Check that files exist in `src/main/resources/webapp/`
3. Clear browser cache
4. Check browser console for errors (F12)

### Files Not Found (404 Errors)
The server looks for files in this order:
1. Classpath resources (`target/classes/webapp/`)
2. Source directory (`src/main/resources/webapp/`)

Run `mvn compile` to ensure files are copied to the classpath.

## 📁 Project Structure

```
expirysync/
├── src/
│   └── main/
│       ├── java/com/expirysync/
│       │   ├── Main.java                 # Entry point
│       │   ├── api/
│       │   │   ├── WebServer.java        # HTTP Server
│       │   │   └── DSASimulator.java     # Business logic
│       │   └── dsa/                      # Data structures
│       └── resources/
│           └── webapp/                   # Frontend files
│               ├── index.html
│               ├── dashboard.html
│               ├── dsa-demo.html
│               ├── login.html
│               ├── inventory.html
│               ├── add-product.html
│               ├── alerts.html
│               ├── settings.html
│               ├── chatbot.html
│               ├── css/
│               └── js/
├── target/                               # Compiled files
├── pom.xml                               # Maven config
└── HOW_TO_RUN.md                         # This file
```

## 🔄 Development Workflow

1. **Start the server**: Run `Main.java`
2. **Edit frontend files**: Modify HTML/CSS/JS in `src/main/resources/webapp/`
3. **Refresh browser**: Changes to frontend files are visible after page refresh
4. **Edit backend files**: Modify Java files
5. **Restart server**: Stop and run `Main.java` again to see backend changes

## 💡 Quick Tips

- **Backend changes**: Require server restart
- **Frontend changes**: Only require browser refresh (no restart needed)
- **API testing**: Use browser DevTools (F12) Network tab to see API calls
- **Console logs**: Check PowerShell/Terminal for backend logs
- **Browser console**: Check F12 Console for frontend errors

## 🎯 Testing the Connection

To verify backend-frontend connection:

1. **Start the server**
2. **Open browser to** http://localhost:8080
3. **Check browser console** (F12) - should show no errors
4. **Check server console** - should show requests being logged
5. **Try adding a product** - should see API call in both consoles

## 📝 Example: How a Feature Works End-to-End

### Adding a Product

1. **User action**: Fills form on `add-product.html` and clicks submit
2. **Frontend (JavaScript)**: Captures form data, sends POST to `/api/addProduct`
3. **Backend (Java)**: `AddProductHandler` receives request
4. **Processing**: `DSASimulator` processes the product data
5. **Response**: Backend sends JSON response
6. **Frontend**: Receives response, updates UI
7. **Browser**: Shows success message to user

This is the complete flow from browser to Java and back!

---

**Need Help?** 
- Check the server console for errors
- Check browser console (F12) for frontend errors
- Ensure Java 11+ and Maven are installed
- Make sure port 8080 is available
