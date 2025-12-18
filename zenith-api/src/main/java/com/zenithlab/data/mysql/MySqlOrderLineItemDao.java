package com.zenithlab.data.mysql;

import org.springframework.stereotype.Component;
import com.zenithlab.data.OrderLineItemDao;
import com.zenithlab.models.OrderLineItem;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Component
public class MySqlOrderLineItemDao extends MySqlDaoBase implements OrderLineItemDao
{
    public MySqlOrderLineItemDao(DataSource dataSource)
    {
        super(dataSource);
    }

    @Override
    public void create(int orderId, OrderLineItem item)
    {
        String sql = "INSERT INTO order_line_items (order_id, product_id, sales_price, quantity, discount) " +
                " VALUES (?, ?, ?, ?, ?);";

        try (Connection connection = getConnection())
        {
            PreparedStatement statement = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
            statement.setInt(1, orderId);
            statement.setInt(2, item.getProductId());
            statement.setBigDecimal(3, item.getSalesPrice());
            statement.setInt(4, item.getQuantity());
            statement.setBigDecimal(5, item.getDiscount());

            statement.executeUpdate();
        }
        catch (SQLException e)
        {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<OrderLineItem> getByOrderId(int orderId)
    {
        List<OrderLineItem> items = new ArrayList<>();

        String sql = "SELECT * FROM order_line_items WHERE order_id = ?";

        try (Connection connection = getConnection())
        {
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setInt(1, orderId);

            ResultSet row = statement.executeQuery();

            while (row.next())
            {
                OrderLineItem item = mapRow(row);
                items.add(item);
            }
        }
        catch (SQLException e)
        {
            throw new RuntimeException(e);
        }

        return items;
    }

    private OrderLineItem mapRow(ResultSet row) throws SQLException
    {
        int orderLineItemId = row.getInt("order_line_item_id");
        int orderId = row.getInt("order_id");
        int productId = row.getInt("product_id");
        BigDecimal salesPrice = row.getBigDecimal("sales_price");
        int quantity = row.getInt("quantity");
        BigDecimal discount = row.getBigDecimal("discount");

        return new OrderLineItem(orderLineItemId, orderId, productId, salesPrice, quantity, discount);
    }
}
