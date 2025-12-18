package com.zenithlab.models;

import java.time.LocalDate;

public class Job
{
    private int jobId;
    private String title;
    private String department;
    private String location;
    private String jobType;
    private String description;
    private String requirements;
    private String salaryRange;
    private LocalDate postedDate;
    private String status;

    public Job()
    {
    }

    public Job(int jobId, String title, String department, String location, String jobType, String description, String requirements, String salaryRange, LocalDate postedDate, String status)
    {
        this.jobId = jobId;
        this.title = title;
        this.department = department;
        this.location = location;
        this.jobType = jobType;
        this.description = description;
        this.requirements = requirements;
        this.salaryRange = salaryRange;
        this.postedDate = postedDate;
        this.status = status;
    }

    public int getJobId()
    {
        return jobId;
    }

    public void setJobId(int jobId)
    {
        this.jobId = jobId;
    }

    public String getTitle()
    {
        return title;
    }

    public void setTitle(String title)
    {
        this.title = title;
    }

    public String getDepartment()
    {
        return department;
    }

    public void setDepartment(String department)
    {
        this.department = department;
    }

    public String getLocation()
    {
        return location;
    }

    public void setLocation(String location)
    {
        this.location = location;
    }

    public String getJobType()
    {
        return jobType;
    }

    public void setJobType(String jobType)
    {
        this.jobType = jobType;
    }

    public String getDescription()
    {
        return description;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }

    public String getRequirements()
    {
        return requirements;
    }

    public void setRequirements(String requirements)
    {
        this.requirements = requirements;
    }

    public String getSalaryRange()
    {
        return salaryRange;
    }

    public void setSalaryRange(String salaryRange)
    {
        this.salaryRange = salaryRange;
    }

    public LocalDate getPostedDate()
    {
        return postedDate;
    }

    public void setPostedDate(LocalDate postedDate)
    {
        this.postedDate = postedDate;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }
}
