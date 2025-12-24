const express = require('express');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http'); // New
const { Server } = require("socket.io"); // New

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1. SETUP WEBSOCKET SERVER
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow React to connect
        methods: ["GET", "POST"]
    }
});

// 2. SPAWN C++ ENGINE
const engine = spawn('./limitx_engine.exe');
engine.stdout.setEncoding('utf8');

// 3. BROADCAST TRADES
engine.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(`[C++]: ${output}`); // Log to terminal

    // If it's a MATCH, send it to React!
    if (output.includes("MATCH")) {
        // Parse the string to get price/qty (Simple parsing)
        // Format: "🚀 MATCH: 50 units @ $149 ..."
        const parts = output.split(" ");
        const quantity = parts[2];
        const price = parts[5].replace('$', '');

        const tradeData = {
            price: parseFloat(price),
            quantity: parseInt(quantity),
            time: Date.now()
        };

        // EVENT: "trade"
        io.emit('trade', tradeData);
    }
});

engine.stderr.on('data', (data) => {
    console.error(`[C++ Error]: ${data}`);
});

// API ROUTES
app.post('/order', (req, res) => {
    const { type, price, quantity } = req.body;
    if (!type || !price || !quantity) return res.status(400).json({ error: "Missing parameters" });
    const command = `${type.toUpperCase()} ${price} ${quantity}\n`;
    engine.stdin.write(command);
    res.json({ status: "Order Sent" });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 LimitX API + WebSockets running on http://localhost:${PORT}`);
});