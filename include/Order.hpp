#ifndef ORDER_HPP
#define ORDER_HPP

#include <iostream>
#include <ctime>

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

#endif