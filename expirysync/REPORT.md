# ExpirySync — Project Report

## Overview
- **Project:** ExpirySync
- **Language:** Java 11+
- **Build:** Maven
- **Server:** com.sun.net.httpserver.HttpServer
- **Frontend:** Static files in `src/main/resources/webapp/` (HTML/CSS/JS)
- **Entry point:** `com.expirysync.Main`
- **Port:** 8080 (default)

## Purpose
ExpirySync demonstrates inventory tracking with DSA components (queues, stacks, priority queues) and exposes a small web UI and an HTTP API for interactions and demos.

## How to run (Windows)
1. Open Command Prompt (recommended):
   - cd C:\Users\DELL\Desktop\expirysync
   - mvn clean compile exec:java -Dexec.mainClass="com.expirysync.Main"
2. Or in PowerShell (use `--%` to avoid argument parsing):
   - mvn --% clean compile exec:java -Dexec.mainClass=com.expirysync.Main
3. Or run in your IDE by running `com.expirysync.Main`.
4. After the server starts, open: http://localhost:8080

## Quick verification
- Health: GET http://localhost:8080/api/health
- Open pages: `/index.html`, `/dsa-demo.html`, `/dashboard.html`
- Use browser DevTools and server console to inspect requests and logs.

## API Endpoints
- `/api/health` (GET)
- `/api/dashboardStats` (GET)
- `/api/operationLog` (GET)
- `/api/addProduct` (POST)
- `/api/removeProduct?id={id}` (DELETE)
- `/api/processExpired` (POST)
- `/api/getUrgent` (GET)
- `/api/sortProducts?by={field}` (POST)
- `/api/searchProducts` (POST)
- `/api/simulate` (GET)

## Important files
- `src/main/java/com/expirysync/Main.java` — starts server
- `src/main/java/com/expirysync/api/WebServer.java` — HTTP handlers
- `src/main/java/com/expirysync/api/DSASimulator.java` — business logic
- `src/main/java/com/expirysync/dsa/` — DSA implementations
- `src/main/resources/webapp/` — frontend files
- `pom.xml` — project configuration

## Troubleshooting
- Browser shows ERR_CONNECTION_REFUSED → server not running. Start server and check console logs.
- PowerShell may parse `-Dexec.mainClass=...` incorrectly: use `--%` or run in cmd.exe.
- 404 for static files → run `mvn compile` to copy resources to `target/classes/webapp/`.
- Port 8080 in use → find and kill with `netstat -ano | findstr :8080` and `taskkill /PID <pid> /F`.

## Recommendations
- Add `maven-shade-plugin` to produce an executable JAR for easier distribution.
- Add a `launch.json` and `tasks.json` for VS Code to standardize running locally.
- Add unit and integration tests for DSA classes and API handlers.
- Add logging (SLF4J + Logback) for structured logs.

## Next steps (optional)
- I can add `maven-shade` and a VS Code run configuration.
- I can generate a `PRESENTATION.md` (done) or a `.pptx` file with slides.

---

*Report created by GitHub Copilot (Raptor mini, Preview)*