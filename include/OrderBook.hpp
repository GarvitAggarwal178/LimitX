#ifndef ORDERBOOK_HPP
#define ORDERBOOK_HPP

#include "Order.hpp"
#include <map>
#include <list>
#include <vector>

// Comparator for Selling: Ascending Price (Lowest Ask First)
// Default std::map is Ascending, so this is standard.

// Comparator for Buying: Descending Price (Highest Bid First)
// We need std::greater<double> for this.

class OrderBook {
private:
    // ASK SIDE (Sellers): Lowest Price = Priority
    // Key: Price, Value: List of Orders at that price
    std::map<double, std::list<Order>> asks;

    // BID SIDE (Buyers): Highest Price = Priority
    std::map<double, std::list<Order>, std::greater<double>> bids;

public:
    void addOrder(int id, OrderType type, double price, int quantity);
    void match(); // The Core Algorithm
    void printBook(); // Visualization
};

#endif