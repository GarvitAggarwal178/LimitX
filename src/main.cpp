#include <iostream>
#include <vector>
#include <map>
#include <list>
#include <ctime>
#include <algorithm>
#include <functional> // For std::greater

// --- 1. DATA STRUCTURES (Formerly Order.hpp) ---
enum class OrderType { BUY, SELL };

struct Order {
    int id;
    OrderType type;
    double price;
    int quantity;
    long timestamp;

    Order(int _id, OrderType _type, double _price, int _qty) 
        : id(_id), type(_type), price(_price), quantity(_qty) {
        timestamp = std::time(nullptr);
    }
};

// --- 2. THE ENGINE CLASS (Formerly OrderBook.hpp) ---
class OrderBook {
private:
    // ASK SIDE (Sellers): Lowest Price = Priority (Default Map Behavior)
    std::map<double, std::list<Order>> asks;

    // BID SIDE (Buyers): Highest Price = Priority (Need std::greater)
    std::map<double, std::list<Order>, std::greater<double>> bids;

public:
    void addOrder(int id, OrderType type, double price, int quantity) {
        Order newOrder(id, type, price, quantity);

        if (type == OrderType::BUY) {
            bids[price].push_back(newOrder); 
        } else {
            asks[price].push_back(newOrder); 
        }

        match(); // Try to match immediately
    }

    void match() {
        // CONTINUOUS DOUBLE AUCTION ALGORITHM
        while (!bids.empty() && !asks.empty()) {
            auto bestBidIter = bids.begin(); // Highest Bid
            auto bestAskIter = asks.begin(); // Lowest Ask

            double bidPrice = bestBidIter->first;
            double askPrice = bestAskIter->first;

            // CORE MATCHING LOGIC
            if (bidPrice >= askPrice) {
                Order& bidOrder = bestBidIter->second.front();
                Order& askOrder = bestAskIter->second.front();

                int quantity = std::min(bidOrder.quantity, askOrder.quantity);

                // 🚀 EXECUTE TRADE
                std::cout << " MATCH: " << quantity << " units @ $" << askPrice 
                          << " (Buyer: " << bidOrder.id << " | Seller: " << askOrder.id << ")" << std::endl;

                // Update Quantities
                bidOrder.quantity -= quantity;
                askOrder.quantity -= quantity;

                // Cleanup Filled Orders
                if (bidOrder.quantity == 0) {
                    bestBidIter->second.pop_front();
                    if (bestBidIter->second.empty()) bids.erase(bestBidIter);
                }
                if (askOrder.quantity == 0) {
                    bestAskIter->second.pop_front();
                    if (bestAskIter->second.empty()) asks.erase(bestAskIter);
                }
            } else {
                break; // No overlapping prices
            }
        }
    }

    void printBook() {
        std::cout << "\n--- ORDER BOOK ---\n";
        std::cout << "ASKS (Sellers - Lowest First):\n";
        for (auto const& entry : asks) {
            double price = entry.first;
            int totalQty = 0;
            for (const auto& o : entry.second) totalQty += o.quantity;
            std::cout << "  $" << price << " : " << totalQty << "\n";
        }
        
        std::cout << "------------------\n";
        
        std::cout << "BIDS (Buyers - Highest First):\n";
        for (auto const& entry : bids) {
            double price = entry.first;
            int totalQty = 0;
            for (const auto& o : entry.second) totalQty += o.quantity;
            std::cout << "  $" << price << " : " << totalQty << "\n";
        }
        std::cout << "------------------\n\n";
    }
};

// --- 3. THE DRIVER (Main) ---
int main() {
    // Disable syncing with stdio for speed
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);

    OrderBook engine;

    std::string command;
    int id = 1;

    // INFINITE LOOP: Waits for commands from "stdin"
    while (std::cin >> command) {
        if (command == "BUY") {
            double price; 
            int quantity;
            std::cin >> price >> quantity;
            engine.addOrder(id++, OrderType::BUY, price, quantity);
        
        } else if (command == "SELL") {
            double price; 
            int quantity;
            std::cin >> price >> quantity;
            engine.addOrder(id++, OrderType::SELL, price, quantity);
        
        } else if (command == "PRINT") {
            engine.printBook();
        
        } else if (command == "EXIT") {
            break;
        }
    }

    return 0;
}