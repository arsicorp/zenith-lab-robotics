package com.zenithlab.data;

import com.zenithlab.models.Job;

import java.util.List;

public interface JobDao
{
    List<Job> getAllJobs();
    Job getById(int jobId);
}
