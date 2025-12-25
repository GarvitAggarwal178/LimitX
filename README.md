
### **1. LimitX README**

A high-performance trading engine implementing a Central Limit Order Book (CLOB) with real-time web visualization.

**Tech Stack**

* **Core:** C++17 (Matching Logic)
* **Gateway:** Node.js (IPC Bridge)
* **Frontend:** React, WebSockets
* **Architecture:** Hybrid (Child Process Communication)

**Key Features**

* **Order Matching:** Implements Price-Time Priority logic for efficient  order insertion and execution.
* **Hybrid Architecture:** Bridges a low-latency C++ core with a Node.js API using standard I/O streams (`stdin`/`stdout`).
* **Real-Time Data:** Broadcasts trade execution and market updates to the frontend via WebSockets.
* **Market Simulation:** Includes a load-test script to generate concurrent order flow (500+ req/s).

**How to Run**

**1. Prerequisites**

* GCC Compiler (g++)
* Node.js (v16+)

**2. Setup & Execution**

```bash
# 1. Compile the C++ Engine
# This creates the binary that the Node.js server will spawn
g++ -std=c++17 -o limitx_engine src/main.cpp

# 2. Install Dependencies
npm install

# 3. Run the System
# Starts the Node server, which automatically launches the C++ engine
npm start

```

**API Usage (Example)**
The engine accepts orders via HTTP POST which are piped to the C++ core:

```json
POST /order
{
  "type": "buy",
  "price": 105.50,
  "quantity": 10
}

```

---
