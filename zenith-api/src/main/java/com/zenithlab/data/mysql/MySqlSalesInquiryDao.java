package com.zenithlab.data.mysql;

import org.springframework.stereotype.Component;
import com.zenithlab.data.SalesInquiryDao;
import com.zenithlab.models.SalesInquiry;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDateTime;

@Component
public class MySqlSalesInquiryDao extends MySqlDaoBase implements SalesInquiryDao
{
    public MySqlSalesInquiryDao(DataSource dataSource)
    {
        super(dataSource);
    }

    @Override
    public SalesInquiry create(SalesInquiry inquiry)
    {
        String sql = "INSERT INTO sales_inquiries (product_id, contact_name, company_name, email, phone, message, inquiry_date, status) " +
                " VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, 'NEW');";

        try (Connection connection = getConnection())
        {
            PreparedStatement statement = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
            statement.setInt(1, inquiry.getProductId());
            statement.setString(2, inquiry.getContactName());
            statement.setString(3, inquiry.getCompanyName());
            statement.setString(4, inquiry.getEmail());
            statement.setString(5, inquiry.getPhone());
            statement.setString(6, inquiry.getMessage());

            int rowsAffected = statement.executeUpdate();

            if (rowsAffected > 0) {
                // retrieve the generated keys
                ResultSet generatedKeys = statement.getGeneratedKeys();

                if (generatedKeys.next()) {
                    // retrieve the auto-incremented id
                    int inquiryId = generatedKeys.getInt(1);

                    // set the generated id and default values on the inquiry object
                    inquiry.setInquiryId(inquiryId);
                    inquiry.setInquiryDate(LocalDateTime.now());
                    inquiry.setStatus("NEW");

                    return inquiry;
                }
            }
        }
        catch (SQLException e)
        {
            throw new RuntimeException(e);
        }

        return null;
    }
}
