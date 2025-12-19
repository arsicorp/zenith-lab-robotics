package com.zenithlab.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.zenithlab.data.OrderDao;
import com.zenithlab.data.OrderLineItemDao;
import com.zenithlab.data.ProfileDao;
import com.zenithlab.data.ShoppingCartDao;
import com.zenithlab.data.UserDao;
import com.zenithlab.models.*;

import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("orders")
@CrossOrigin
@PreAuthorize("isAuthenticated()")
public class OrdersController
{
    private OrderDao orderDao;
    private OrderLineItemDao orderLineItemDao;
    private ShoppingCartDao shoppingCartDao;
    private UserDao userDao;
    private ProfileDao profileDao;

    @Autowired
    public OrdersController(OrderDao orderDao, OrderLineItemDao orderLineItemDao, ShoppingCartDao shoppingCartDao, UserDao userDao, ProfileDao profileDao)
    {
        this.orderDao = orderDao;
        this.orderLineItemDao = orderLineItemDao;
        this.shoppingCartDao = shoppingCartDao;
        this.userDao = userDao;
        this.profileDao = profileDao;
    }

    @PostMapping("")
    public Order checkout(Principal principal)
    {
        try
        {
            // get the currently logged in username
            String userName = principal.getName();
            // find database user by username
            User user = userDao.getByUserName(userName);
            int userId = user.getId();

            // get the user's shopping cart
            ShoppingCart cart = shoppingCartDao.getByUserId(userId);

            // validate cart is not empty
            if (cart.getItems().isEmpty())
            {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Shopping cart is empty");
            }

            // get the user's profile for address information
            Profile profile = profileDao.getByUserId(userId);

            if (profile == null)
            {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User profile not found");
            }

            // validate buyer restrictions
            String accountType = profile.getAccountType();
            System.out.println("===== BUYER RESTRICTION VALIDATION =====");
            System.out.println("User account type: " + (accountType != null ? accountType : "NULL"));

            for (ShoppingCartItem cartItem : cart.getItems().values())
            {
                Product product = cartItem.getProduct();
                String buyerRequirement = product.getBuyerRequirement();

                System.out.println("Product: " + product.getName() + " | Buyer Requirement: " + (buyerRequirement != null ? buyerRequirement : "NULL"));

                // validate buyer restrictions
                if (buyerRequirement != null && !buyerRequirement.isEmpty())
                {
                    // check if user account type matches the requirement
                    if (buyerRequirement.equals("BUSINESS") && !"BUSINESS".equals(accountType))
                    {
                        System.out.println("VALIDATION FAILED: Product requires BUSINESS but user has " + accountType);
                        throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                            "Product '" + product.getName() + "' requires a BUSINESS account");
                    }
                    else if (buyerRequirement.equals("MEDICAL") && !"MEDICAL".equals(accountType))
                    {
                        System.out.println("VALIDATION FAILED: Product requires MEDICAL but user has " + accountType);
                        throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                            "Product '" + product.getName() + "' requires a MEDICAL account");
                    }
                    else if (buyerRequirement.equals("GOVERNMENT") && !"GOVERNMENT".equals(accountType))
                    {
                        System.out.println("VALIDATION FAILED: Product requires GOVERNMENT but user has " + accountType);
                        throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                            "Product '" + product.getName() + "' requires a GOVERNMENT account");
                    }
                    else
                    {
                        System.out.println("VALIDATION PASSED: User account type matches requirement");
                    }
                }
                else
                {
                    System.out.println("VALIDATION SKIPPED: No buyer requirement set for this product");
                }
            }
            System.out.println("===== VALIDATION COMPLETE =====");

            // calculate order total from cart
            BigDecimal orderTotal = cart.getTotal();

            // create order record
            Order order = new Order();
            order.setUserId(userId);
            order.setDate(LocalDate.now());
            // copy address from profile
            order.setAddress(profile.getAddress());
            order.setCity(profile.getCity());
            order.setState(profile.getState());
            order.setZip(profile.getZip());
            order.setShippingAmount(BigDecimal.ZERO);
            order.setOrderTotal(orderTotal);

            // save the order and get the generated order id
            Order createdOrder = orderDao.create(order);

            if (createdOrder == null)
            {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create order");
            }

            // create order line items for each cart item
            for (ShoppingCartItem cartItem : cart.getItems().values())
            {
                OrderLineItem lineItem = new OrderLineItem();
                lineItem.setOrderId(createdOrder.getOrderId());
                lineItem.setProductId(cartItem.getProduct().getProductId());
                lineItem.setSalesPrice(cartItem.getProduct().getPrice());
                lineItem.setQuantity(cartItem.getQuantity());
                lineItem.setDiscount(cartItem.getDiscountPercent());

                orderLineItemDao.create(createdOrder.getOrderId(), lineItem);
            }

            // clear shopping cart
            shoppingCartDao.clearCart(userId);

            // return the created order
            return createdOrder;
        }
        catch(ResponseStatusException ex)
        {
            // rethrow response status exceptions
            throw ex;
        }
        catch(Exception ex)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Oops... our bad.");
        }
    }

    @GetMapping("")
    public List<Order> getOrders(Principal principal)
    {
        try
        {
            // get the currently logged in username
            String userName = principal.getName();
            // find database user by username
            User user = userDao.getByUserName(userName);
            int userId = user.getId();

            // get all orders for this user
            return orderDao.getOrdersByUserId(userId);
        }
        catch(Exception ex)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Oops... our bad.");
        }
    }

    @GetMapping("{id}")
    public Order getOrderById(@PathVariable int id, Principal principal)
    {
        try
        {
            // get the currently logged in username
            String userName = principal.getName();
            // find database user by username
            User user = userDao.getByUserName(userName);
            int userId = user.getId();

            // get the order by id
            Order order = orderDao.getById(id);

            if (order == null)
            {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "order not found");
            }

            // check if this order belongs to current user
            if (order.getUserId() != userId)
            {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "access denied");
            }

            // get line items for this order
            List<OrderLineItem> lineItems = orderLineItemDao.getByOrderId(id);
            order.setLineItems(lineItems);

            return order;
        }
        catch(ResponseStatusException ex)
        {
            throw ex;
        }
        catch(Exception ex)
        {
            ex.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "error: " + ex.getMessage());
        }
    }
}
