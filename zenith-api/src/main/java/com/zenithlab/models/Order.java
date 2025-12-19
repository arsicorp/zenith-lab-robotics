package com.zenithlab.models;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class Order
{
    private int orderId;
    private int userId;
    private LocalDate date;
    private String address;
    private String city;
    private String state;
    private String zip;
    private BigDecimal shippingAmount;
    private BigDecimal orderTotal;
    private List<OrderLineItem> lineItems;

    public Order()
    {
    }

    public Order(int orderId, int userId, LocalDate date, String address, String city, String state, String zip, BigDecimal shippingAmount, BigDecimal orderTotal)
    {
        this.orderId = orderId;
        this.userId = userId;
        this.date = date;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.shippingAmount = shippingAmount;
        this.orderTotal = orderTotal;
    }

    public Order(int orderId, int userId, LocalDate date, String address, String city, String state, String zip, BigDecimal shippingAmount, BigDecimal orderTotal, List<OrderLineItem> lineItems)
    {
        this.orderId = orderId;
        this.userId = userId;
        this.date = date;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.shippingAmount = shippingAmount;
        this.orderTotal = orderTotal;
        this.lineItems = lineItems;
    }

    public int getOrderId()
    {
        return orderId;
    }

    public void setOrderId(int orderId)
    {
        this.orderId = orderId;
    }

    public int getUserId()
    {
        return userId;
    }

    public void setUserId(int userId)
    {
        this.userId = userId;
    }

    public LocalDate getDate()
    {
        return date;
    }

    public void setDate(LocalDate date)
    {
        this.date = date;
    }

    public String getAddress()
    {
        return address;
    }

    public void setAddress(String address)
    {
        this.address = address;
    }

    public String getCity()
    {
        return city;
    }

    public void setCity(String city)
    {
        this.city = city;
    }

    public String getState()
    {
        return state;
    }

    public void setState(String state)
    {
        this.state = state;
    }

    public String getZip()
    {
        return zip;
    }

    public void setZip(String zip)
    {
        this.zip = zip;
    }

    public BigDecimal getShippingAmount()
    {
        return shippingAmount;
    }

    public void setShippingAmount(BigDecimal shippingAmount)
    {
        this.shippingAmount = shippingAmount;
    }

    public BigDecimal getOrderTotal()
    {
        return orderTotal;
    }

    public void setOrderTotal(BigDecimal orderTotal)
    {
        this.orderTotal = orderTotal;
    }

    public List<OrderLineItem> getLineItems()
    {
        return lineItems;
    }

    public void setLineItems(List<OrderLineItem> lineItems)
    {
        this.lineItems = lineItems;
    }
}
