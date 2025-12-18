package com.zenithlab.data;

import com.zenithlab.models.OrderLineItem;

import java.util.List;

public interface OrderLineItemDao
{
    void create(int orderId, OrderLineItem item);
    List<OrderLineItem> getByOrderId(int orderId);
}
