const http = require('http');

// CONFIGURATION
const API_URL = 'http://localhost:3000/order';
const SYMBOL_PRICE = 150; // Starting price for AAPL
const SPREAD = 2; // Difference between Buy and Sell

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function placeOrder(type, price, quantity) {
    const data = JSON.stringify({ type, price, quantity });

    const req = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/order',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }, (res) => {
        // We don't care about the response body, just that it worked
        // process.stdout.write('.'); // Print a dot for every order
    });

    req.on('error', (e) => console.error(`Problem: ${e.message}`));
    req.write(data);
    req.end();
}

console.log("🤖 MARKET MAKER ACTIVATED...");
console.log("Press Ctrl+C to stop.");

// LOOP: Run every 500ms
setInterval(() => {
    // 1. Generate Random Noise
    const noise = getRandomInt(-5, 5); 
    const price = SYMBOL_PRICE + noise;

    // 2. Place a SELL Order (Ask) slightly higher
    const askPrice = price + getRandomInt(1, SPREAD);
    const askQty = getRandomInt(1, 100);
    placeOrder("SELL", askPrice, askQty);

    // 3. Place a BUY Order (Bid) slightly lower
    const bidPrice = price - getRandomInt(1, SPREAD);
    const bidQty = getRandomInt(1, 100);
    placeOrder("BUY", bidPrice, bidQty);

    // 4. Sometimes, place a "Market Order" (Cross the spread) to cause a MATCH
    if (Math.random() > 0.7) {
        // Aggressive Buyer
        placeOrder("BUY", askPrice, getRandomInt(1, 50));
        console.log(`💥 AGGRESSIVE BUY @ $${askPrice}`);
    }

}, 200); 