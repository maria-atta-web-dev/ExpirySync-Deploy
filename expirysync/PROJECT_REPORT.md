# ExpirySync — Project Report 📋

> Concise summary of the project, how to run it, checks to verify it's working, troubleshooting tips, and recommended improvements.

---

## 1. Project Overview 🔍
- **Name:** ExpirySync
- **Language:** Java (≥11)
- **Build:** Maven
- **Server:** Java built-in com.sun.net.httpserver.HttpServer
- **Frontend:** Static files (HTML/CSS/JS) under `src/main/resources/webapp/`
- **Entry point:** `com.expirysync.Main`
- **Default port:** **8080**

ExpirySync is an inventory demo that exposes a web frontend and a small REST-style API. The server serves static files and implements DSA demo functionality via `DSASimulator` and several handlers in `WebServer`.

---

## 2. How to run (Windows-focused) 🚀

### A — Command Prompt (Recommended)
1. Open **Command Prompt** (avoid PowerShell quoting issues).
2. Run:
```bash
cd C:\Users\DELL\Desktop\expirysync
mvn clean compile exec:java -Dexec.mainClass="com.expirysync.Main"
```
3. Wait for the message: `=== ExpirySync Server Started Successfully! ===`
4. Open: `http://localhost:8080`

### B — PowerShell (alternate)
- Use `--%` so PowerShell stops interpreting arguments:
```powershell
cd C:\Users\DELL\Desktop\expirysync
mvn --% clean compile exec:java -Dexec.mainClass=com.expirysync.Main
```

### C — IDE (IntelliJ / Eclipse / VS Code)
- Import as Maven project and run `com.expirysync.Main`.

### D — Runnable JAR (recommended for distribution)
- Add a fat-jar config (maven-shade), then:
```bash
mvn clean package
java -jar target/expirysync-1.0.0.jar
```

> NOTE: A known Windows issue: PowerShell sometimes mangles `-Dexec.mainClass=...`. Use `--%` or run in **cmd.exe**.

---

## 3. Quick verification & health checks ✅
- Health endpoint:
```
GET http://localhost:8080/api/health
```
- Example curl (PowerShell):
```powershell
Invoke-RestMethod http://localhost:8080/api/health
```
- Check server console for request logs (the server prints activity for each API request).
- Confirm static files served: `http://localhost:8080/index.html` (or `/dsa-demo.html`, `/dashboard.html`).

---

## 4. API endpoints (summary) 🔗
| Endpoint | Method | Description |
|---|---:|---|
| `/api/health` | GET | Health check |
| `/api/dashboardStats` | GET | Dashboard stats |
| `/api/operationLog` | GET | Operation log |
| `/api/addProduct` | POST | Add product (JSON body) |
| `/api/removeProduct?id={id}` | DELETE | Remove product by id |
| `/api/processExpired` | POST | Process expired products |
| `/api/getUrgent` | GET | Get urgent products |
| `/api/sortProducts?by={field}` | POST | Sort products |
| `/api/searchProducts` | POST | Search products (JSON body) |
| `/api/simulate` | GET | Run the simulation |

---

## 5. Important files & responsibilities 🗂️
- `src/main/java/com/expirysync/Main.java` — entry point, starts `WebServer`.
- `src/main/java/com/expirysync/api/WebServer.java` — HTTP server, static file handler, API handlers.
- `src/main/java/com/expirysync/api/DSASimulator.java` — (business logic simulator for DSA flows).
- `src/main/java/com/expirysync/dsa/` — data structure implementations (ExpiryQueue, InventoryStack, etc.).
- `src/main/resources/webapp/` — frontend assets (HTML/CSS/JS).
- `pom.xml` — Maven configuration (currently does not include shade plugin by default).

---

## 6. Troubleshooting & known issues ⚠️
- ERR_CONNECTION_REFUSED in the browser => server not running; confirm server start logs.
- **PowerShell**: if `-Dexec.mainClass` gets treated as a lifecycle phase, use `mvn --% clean compile exec:java -Dexec.mainClass=com.expirysync.Main` or run in **cmd.exe**.
- If 404 for static files: ensure resources are copied to `target/classes/webapp` (run `mvn compile`).
- If port 8080 is in use:
  - Find process: `netstat -ano | findstr :8080` (cmd) or `Get-NetTCPConnection -LocalPort 8080` (PowerShell)
  - Terminate: `taskkill /PID <pid> /F`

---

## 7. Recommended improvements (PR-ready suggestions) ✨
1. **Add maven-shade plugin** to `pom.xml` (fat/executable JAR). Example snippet:
```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-shade-plugin</artifactId>
  <version>3.4.1</version>
  <executions>
    <execution>
      <phase>package</phase>
      <goals><goal>shade</goal></goals>
      <configuration>
        <transformers>
          <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
            <mainClass>com.expirysync.Main</mainClass>
          </transformer>
        </transformers>
      </configuration>
    </execution>
  </executions>
</plugin>
```
2. **Add an `exec` plugin config** to `pom.xml` so running via `mvn exec:java` doesn't require `-D` overrides.
3. **Add a VS Code launch config** (`.vscode/launch.json`) and a task to run the server reliably.
4. Add unit tests for core DSA classes and some integration tests for the HTTP handlers.
5. Consider adding a small logging framework (SLF4J + Logback) for structured logs and configurable levels.

---

## 8. Security & production notes 🔐
- Current server is intended for demo/local use. Not hardened for production (no TLS, limited validation).
- If publishing, add HTTPS, input validation, authentication, rate limiting, and proper error handling.

---

## 9. Quick checklist for you ✅
- [ ] Confirm Java & Maven installed (`java -version`, `mvn -version`).
- [ ] Start the server in **cmd.exe** or use the PowerShell `--%` escape.
- [ ] Open `http://localhost:8080/` and check `api/health`.
- [ ] Decide if you want me to add: runnable JAR (`maven-shade`) and a VS Code launch config.

---

## 10. Next steps I can implement for you (pick one) 🔧
- Add `maven-shade` configuration and create a run task so you can `mvn clean package` and `java -jar target/expirysync-1.0.0.jar`.
- Add a `launch.json` and `tasks.json` for reliable local runs in VS Code.
- Add small integration tests for API endpoints and a basic README HOWTO update.

---

If you want, I can add the runnable JAR setup and a VS Code launch task now — tell me which you'd like ("shade", "vscode-launch", or "both").

---

## 11. Presentation / PPT content (slide‑by‑slide) 🎤
Below is a ready‑to‑use slide breakdown you can paste into PowerPoint, Google Slides, or any other presentation tool. Each slide includes concise bullets and short speaker notes.

### Slide 1 — Title
- Title: ExpirySync — Inventory DSA Demo
- Subtitle: Demo project serving a web frontend with a Java HTTP server
- Speaker notes: Briefly introduce yourself and the goal: demonstrate a small Java app that uses data structures to manage expiry and inventory flows.

### Slide 2 — Problem & Motivation
- Problem: Managing perishable inventory and identifying expired/urgent items
- Motivation: Showcase DSA usage (queues, stacks, priority queues) in a full‑stack demo
- Speaker notes: Mention common real‑world needs like supermarkets, pharmacies — why expiry tracking matters.

### Slide 3 — Project Overview
- Tech stack: Java 11, Maven, built‑in HttpServer, HTML/CSS/JS frontend
- Entry point: `com.expirysync.Main` — starts server on port 8080
- Speaker notes: Explain how backend serves both static frontend and provides REST endpoints.

### Slide 4 — Architecture
- Frontend: `src/main/resources/webapp/` (HTML/JS) served by backend
- Backend: `WebServer.java` handles static files + API endpoints
- DSA core: `DSASimulator` + `dsa/` classes (ExpiryQueue, InventoryStack, PriorityExpiryQueue)
- Speaker notes: Use a simple diagram (Browser ↔ Server ↔ DSA) to visualize flow.

### Slide 5 — How it works (Flow)
- Add product → frontend sends POST `/api/addProduct`
- Server updates data structures and logs operation
- View urgent/expired via `/api/getUrgent` and `/api/processExpired`
- Speaker notes: Walk through one example product addition and expiry processing.

### Slide 6 — Demo / Run steps
- Step 1: Build & run: `mvn clean compile exec:java -Dexec.mainClass="com.expirysync.Main"`
- Step 2: Open `http://localhost:8080` and navigate to DSA demo
- Step 3: Use UI to add products, run simulation, view logs
- Speaker notes: Emphasize PowerShell vs cmd note and quick health check `/api/health`.

### Slide 7 — API highlights
- `/api/health`, `/api/addProduct`, `/api/removeProduct`, `/api/processExpired`, `/api/getUrgent`
- Example: `Invoke-RestMethod http://localhost:8080/api/health`
- Speaker notes: Suggest using browser DevTools and server console to observe interactions.

### Slide 8 — Troubleshooting & Tips
- If `ERR_CONNECTION_REFUSED`, ensure server is running on port 8080
- PowerShell might mangled `-Dexec.mainClass` — use `--%` or cmd.exe
- Ensure resources are copied with `mvn compile` if static files 404

### Slide 9 — Improvements & Roadmap
- Create runnable JAR (maven-shade), add VS Code launch config
- Add unit & integration tests, logging (SLF4J + Logback), and basic auth for APIs
- Speaker notes: Prioritize a runnable JAR and tests for easier demos and CI.

### Slide 10 — Q&A
- Invite questions, offer to run a live demo
- Speaker notes: Prepare to show the DSA demo page and server logs in real time.

---

If you want, I can also generate a `PRESENTATION.md` with the same slides formatted for conversion to slides or create a minimal PowerPoint `.pptx` file containing these slides. Which would you prefer? ("PRESENTATION.md", "pptx", or "none")

*Generated by GitHub Copilot (Raptor mini, Preview)*
