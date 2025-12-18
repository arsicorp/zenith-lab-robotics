package com.zenithlab.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.zenithlab.data.JobApplicationDao;
import com.zenithlab.models.JobApplication;

@RestController
@RequestMapping("job-applications")
@CrossOrigin
@PreAuthorize("permitAll()")
public class JobApplicationsController
{
    private JobApplicationDao jobApplicationDao;

    @Autowired
    public JobApplicationsController(JobApplicationDao jobApplicationDao)
    {
        this.jobApplicationDao = jobApplicationDao;
    }

    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    public JobApplication submitApplication(@RequestBody JobApplication application)
    {
        try
        {
            // validate required fields
            if (application.getJobId() <= 0)
            {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Job ID is required");
            }

            if (application.getApplicantName() == null || application.getApplicantName().trim().isEmpty())
            {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Applicant name is required");
            }

            if (application.getEmail() == null || application.getEmail().trim().isEmpty())
            {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
            }

            // create the job application
            JobApplication createdApplication = jobApplicationDao.create(application);

            if (createdApplication == null)
            {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create job application");
            }

            return createdApplication;
        }
        catch(ResponseStatusException ex)
        {
            // rethrow response status exceptions
            throw ex;
        }
        catch(Exception ex)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Oops... our bad.");
        }
    }
}
