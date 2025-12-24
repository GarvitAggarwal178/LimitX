const express = require('express');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1. SPAWN THE C++ ENGINE
// We keep it alive in the background
const engine = spawn('./limitx_engine.exe');

engine.stdout.setEncoding('utf8');

// 2. LISTEN TO C++ OUTPUT
engine.stdout.on('data', (data) => {
    // This logs whatever the C++ app prints (Matches, Order Book)
    console.log(`[C++ Engine]: \n${data}`);
});

engine.stderr.on('data', (data) => {
    console.error(`[C++ Error]: ${data}`);
});

// 3. API ROUTES

// POST /order -> Sends "BUY" or "SELL" to C++
app.post('/order', (req, res) => {
    const { type, price, quantity } = req.body; // { type: "BUY", price: 150, quantity: 10 }

    if (!type || !price || !quantity) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    // Convert API JSON -> C++ Command
    // Example: "BUY 150 10\n"
    const command = `${type.toUpperCase()} ${price} ${quantity}\n`;
    
    // Write to C++ Stdin
    engine.stdin.write(command);

    res.json({ status: "Order Sent", command: command.trim() });
});

// GET /book -> Asks C++ to print the book
// Note: In a real app, we'd parse the output. For now, check the console.
app.get('/book', (req, res) => {
    engine.stdin.write("PRINT\n");
    res.json({ status: "Requesting OrderBook check server console" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 LimitX API running on http://localhost:${PORT}`);
});