package com.zenithlab.data;

import com.zenithlab.models.JobApplication;

import java.util.List;

public interface JobApplicationDao
{
    JobApplication create(JobApplication application);
    List<JobApplication> getAllJobApplications();
}
