package com.zenithlab.data.mysql;

import org.springframework.stereotype.Component;
import com.zenithlab.data.JobDao;
import com.zenithlab.models.Job;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
public class MySqlJobDao extends MySqlDaoBase implements JobDao
{
    public MySqlJobDao(DataSource dataSource)
    {
        super(dataSource);
    }

    @Override
    public List<Job> getAllJobs()
    {
        List<Job> jobs = new ArrayList<>();

        String sql = "SELECT * FROM jobs WHERE status = 'OPEN' ORDER BY posted_date DESC";

        try (Connection connection = getConnection())
        {
            PreparedStatement statement = connection.prepareStatement(sql);

            ResultSet row = statement.executeQuery();

            while (row.next())
            {
                Job job = mapRow(row);
                jobs.add(job);
            }
        }
        catch (SQLException e)
        {
            throw new RuntimeException(e);
        }

        return jobs;
    }

    @Override
    public Job getById(int jobId)
    {
        String sql = "SELECT * FROM jobs WHERE job_id = ?";

        try (Connection connection = getConnection())
        {
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setInt(1, jobId);

            ResultSet row = statement.executeQuery();

            if (row.next())
            {
                return mapRow(row);
            }
        }
        catch (SQLException e)
        {
            throw new RuntimeException(e);
        }

        return null;
    }

    private Job mapRow(ResultSet row) throws SQLException
    {
        int jobId = row.getInt("job_id");
        String title = row.getString("title");
        String department = row.getString("department");
        String location = row.getString("location");
        String jobType = row.getString("job_type");
        String description = row.getString("description");
        String requirements = row.getString("requirements");
        String salaryRange = row.getString("salary_range");
        LocalDate postedDate = row.getDate("posted_date").toLocalDate();
        String status = row.getString("status");

        return new Job(jobId, title, department, location, jobType, description, requirements, salaryRange, postedDate, status);
    }
}
