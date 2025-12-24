// test_api.js
const http = require('http');

function sendOrder(type, price, quantity) {
    const data = JSON.stringify({ type, price, quantity });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/order',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = http.request(options, (res) => {
        console.log(`Sent ${type} ${quantity}@$${price} | Status: ${res.statusCode}`);
        res.on('data', d => process.stdout.write(d));
    });

    req.on('error', (error) => {
        console.error(error);
    });

    req.write(data);
    req.end();
}

// 1. Place a Sell Order (Liquidity)
console.log("--- Sending Orders ---");
sendOrder("SELL", 100, 50);

// 2. Wait 1 second, then Match it
setTimeout(() => {
    sendOrder("BUY", 100, 10);
}, 1000);