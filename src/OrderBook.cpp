#include "../include/OrderBook.hpp"
#include <iostream>

void OrderBook::addOrder(int id, OrderType type, double price, int quantity) {
    Order newOrder(id, type, price, quantity);

    if (type == OrderType::BUY) {
        bids[price].push_back(newOrder); // O(log N) lookup + O(1) insert
    } else {
        asks[price].push_back(newOrder); // O(log N) lookup + O(1) insert
    }

    // Attempt to match immediately after adding
    match(); 
}

void OrderBook::match() {
    // While both sides have orders...
    while (!bids.empty() && !asks.empty()) {
        // Look at the Best Bid (Highest) and Best Ask (Lowest)
        // map::begin() gives the first element (Best Price)
        auto bestBidIter = bids.begin();
        auto bestAskIter = asks.begin();

        double bidPrice = bestBidIter->first;
        double askPrice = bestAskIter->first;

        // Condition: Does Buyer pay enough?
        if (bidPrice >= askPrice) {
            // Get the actual Order objects (FIFO - First In First Out)
            Order& bidOrder = bestBidIter->second.front();
            Order& askOrder = bestAskIter->second.front();

            // Calculate Trade Quantity
            int quantity = std::min(bidOrder.quantity, askOrder.quantity);

            // EXECUTE TRADE
            std::cout << "🚀 MATCH: " << quantity << " units @ $" << askPrice 
                      << " (Buyer: " << bidOrder.id << " | Seller: " << askOrder.id << ")" << std::endl;

            // Update Quantities
            bidOrder.quantity -= quantity;
            askOrder.quantity -= quantity;

            // Cleanup: Remove filled orders
            if (bidOrder.quantity == 0) {
                bestBidIter->second.pop_front(); // Remove from list
                if (bestBidIter->second.empty()) {
                    bids.erase(bestBidIter); // Remove price level if empty
                }
            }
            if (askOrder.quantity == 0) {
                bestAskIter->second.pop_front();
                if (bestAskIter->second.empty()) {
                    asks.erase(bestAskIter);
                }
            }
        } else {
            // No overlap in prices = No more trades possible
            break; 
        }
    }
}

void OrderBook::printBook() {
    std::cout << "\n--- ORDER BOOK ---\n";
    std::cout << "ASKS (Sellers - Lowest First):\n";
    for (auto const& [price, list] : asks) {
        int totalQty = 0;
        for (const auto& o : list) totalQty += o.quantity;
        std::cout << "  $" << price << " : " << totalQty << "\n";
    }
    
    std::cout << "------------------\n";
    
    std::cout << "BIDS (Buyers - Highest First):\n";
    for (auto const& [price, list] : bids) {
        int totalQty = 0;
        for (const auto& o : list) totalQty += o.quantity;
        std::cout << "  $" << price << " : " << totalQty << "\n";
    }
    std::cout << "------------------\n\n";
}