package com.zenithlab.data;

import com.zenithlab.models.Order;

import java.util.List;

public interface OrderDao
{
    Order create(Order order);
    List<Order> getOrdersByUserId(int userId);
    Order getById(int orderId);
    List<Order> getAllOrders();
}
