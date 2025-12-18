package com.zenithlab.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.zenithlab.data.JobDao;
import com.zenithlab.models.Job;

import java.util.List;

@RestController
@RequestMapping("jobs")
@CrossOrigin
@PreAuthorize("permitAll()")
public class JobsController
{
    private JobDao jobDao;

    @Autowired
    public JobsController(JobDao jobDao)
    {
        this.jobDao = jobDao;
    }

    @GetMapping("")
    public List<Job> getAllJobs()
    {
        try
        {
            // get all open jobs ordered by posted date
            return jobDao.getAllJobs();
        }
        catch(Exception ex)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Oops... our bad.");
        }
    }

    @GetMapping("{id}")
    public Job getById(@PathVariable int id)
    {
        try
        {
            // get job by id
            var job = jobDao.getById(id);

            if(job == null)
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);

            return job;
        }
        catch(Exception ex)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Oops... our bad.");
        }
    }
}
