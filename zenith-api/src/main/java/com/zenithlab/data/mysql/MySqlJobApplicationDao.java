package com.zenithlab.data.mysql;

import org.springframework.stereotype.Component;
import com.zenithlab.data.JobApplicationDao;
import com.zenithlab.models.JobApplication;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDateTime;

@Component
public class MySqlJobApplicationDao extends MySqlDaoBase implements JobApplicationDao
{
    public MySqlJobApplicationDao(DataSource dataSource)
    {
        super(dataSource);
    }

    @Override
    public JobApplication create(JobApplication application)
    {
        String sql = "INSERT INTO job_applications (job_id, applicant_name, email, phone, resume_url, cover_letter, applied_date, status) " +
                " VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, 'PENDING');";

        try (Connection connection = getConnection())
        {
            PreparedStatement statement = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
            statement.setInt(1, application.getJobId());
            statement.setString(2, application.getApplicantName());
            statement.setString(3, application.getEmail());
            statement.setString(4, application.getPhone());
            statement.setString(5, application.getResumeUrl());
            statement.setString(6, application.getCoverLetter());

            int rowsAffected = statement.executeUpdate();

            if (rowsAffected > 0) {
                // retrieve the generated keys
                ResultSet generatedKeys = statement.getGeneratedKeys();

                if (generatedKeys.next()) {
                    // retrieve the auto-incremented id
                    int applicationId = generatedKeys.getInt(1);

                    // set the generated id and default values on the application object
                    application.setApplicationId(applicationId);
                    application.setAppliedDate(LocalDateTime.now());
                    application.setStatus("PENDING");

                    return application;
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
