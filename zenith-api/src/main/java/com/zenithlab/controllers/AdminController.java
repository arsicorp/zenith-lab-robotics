package com.zenithlab.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.zenithlab.data.JobApplicationDao;
import com.zenithlab.data.OrderDao;
import com.zenithlab.data.SalesInquiryDao;
import com.zenithlab.models.JobApplication;
import com.zenithlab.models.Order;
import com.zenithlab.models.SalesInquiry;

import java.util.List;

@RestController
@RequestMapping("admin")
@CrossOrigin
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminController
{
    private OrderDao orderDao;
    private JobApplicationDao jobApplicationDao;
    private SalesInquiryDao salesInquiryDao;

    @Autowired
    public AdminController(OrderDao orderDao, JobApplicationDao jobApplicationDao, SalesInquiryDao salesInquiryDao)
    {
        this.orderDao = orderDao;
        this.jobApplicationDao = jobApplicationDao;
        this.salesInquiryDao = salesInquiryDao;
    }

    @GetMapping("orders")
    public List<Order> getAllOrders()
    {
        try
        {
            // get all orders from database
            return orderDao.getAllOrders();
        }
        catch(Exception ex)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Oops... our bad.");
        }
    }

    @GetMapping("job-applications")
    public List<JobApplication> getAllJobApplications()
    {
        try
        {
            // get all job applications from database
            return jobApplicationDao.getAllJobApplications();
        }
        catch(Exception ex)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Oops... our bad.");
        }
    }

    @GetMapping("sales-inquiries")
    public List<SalesInquiry> getAllSalesInquiries()
    {
        try
        {
            // get all sales inquiries from database
            return salesInquiryDao.getAllSalesInquiries();
        }
        catch(Exception ex)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Oops... our bad.");
        }
    }
}
