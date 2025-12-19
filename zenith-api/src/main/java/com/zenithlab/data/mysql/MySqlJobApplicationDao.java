package com.zenithlab.data.mysql;

import org.springframework.stereotype.Component;
import com.zenithlab.data.JobApplicationDao;
import com.zenithlab.models.JobApplication;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @Override
    public List<JobApplication> getAllJobApplications()
    {
        List<JobApplication> applications = new ArrayList<>();

        String sql = "SELECT * FROM job_applications ORDER BY applied_date DESC";

        try (Connection connection = getConnection())
        {
            PreparedStatement statement = connection.prepareStatement(sql);

            ResultSet row = statement.executeQuery();

            while (row.next())
            {
                JobApplication application = mapRow(row);
                applications.add(application);
            }
        }
        catch (SQLException e)
        {
            throw new RuntimeException(e);
        }

        return applications;
    }

    private JobApplication mapRow(ResultSet row) throws SQLException
    {
        int applicationId = row.getInt("application_id");
        int jobId = row.getInt("job_id");
        String applicantName = row.getString("applicant_name");
        String email = row.getString("email");
        String phone = row.getString("phone");
        String resumeUrl = row.getString("resume_url");
        String coverLetter = row.getString("cover_letter");
        LocalDateTime appliedDate = row.getTimestamp("applied_date").toLocalDateTime();
        String status = row.getString("status");

        JobApplication application = new JobApplication();
        application.setApplicationId(applicationId);
        application.setJobId(jobId);
        application.setApplicantName(applicantName);
        application.setEmail(email);
        application.setPhone(phone);
        application.setResumeUrl(resumeUrl);
        application.setCoverLetter(coverLetter);
        application.setAppliedDate(appliedDate);
        application.setStatus(status);

        return application;
    }
}
