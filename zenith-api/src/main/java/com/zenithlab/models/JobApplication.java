package com.zenithlab.models;

import java.time.LocalDateTime;

public class JobApplication
{
    private int applicationId;
    private int jobId;
    private String applicantName;
    private String email;
    private String phone;
    private String resumeUrl;
    private String coverLetter;
    private LocalDateTime appliedDate;
    private String status;

    public JobApplication()
    {
    }

    public JobApplication(int applicationId, int jobId, String applicantName, String email, String phone, String resumeUrl, String coverLetter, LocalDateTime appliedDate, String status)
    {
        this.applicationId = applicationId;
        this.jobId = jobId;
        this.applicantName = applicantName;
        this.email = email;
        this.phone = phone;
        this.resumeUrl = resumeUrl;
        this.coverLetter = coverLetter;
        this.appliedDate = appliedDate;
        this.status = status;
    }

    public int getApplicationId()
    {
        return applicationId;
    }

    public void setApplicationId(int applicationId)
    {
        this.applicationId = applicationId;
    }

    public int getJobId()
    {
        return jobId;
    }

    public void setJobId(int jobId)
    {
        this.jobId = jobId;
    }

    public String getApplicantName()
    {
        return applicantName;
    }

    public void setApplicantName(String applicantName)
    {
        this.applicantName = applicantName;
    }

    public String getEmail()
    {
        return email;
    }

    public void setEmail(String email)
    {
        this.email = email;
    }

    public String getPhone()
    {
        return phone;
    }

    public void setPhone(String phone)
    {
        this.phone = phone;
    }

    public String getResumeUrl()
    {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl)
    {
        this.resumeUrl = resumeUrl;
    }

    public String getCoverLetter()
    {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter)
    {
        this.coverLetter = coverLetter;
    }

    public LocalDateTime getAppliedDate()
    {
        return appliedDate;
    }

    public void setAppliedDate(LocalDateTime appliedDate)
    {
        this.appliedDate = appliedDate;
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
