package com.zenithlab.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.zenithlab.data.SalesInquiryDao;
import com.zenithlab.models.SalesInquiry;

@RestController
@RequestMapping("sales-inquiries")
@CrossOrigin
@PreAuthorize("permitAll()")
public class SalesInquiriesController
{
    private SalesInquiryDao salesInquiryDao;

    @Autowired
    public SalesInquiriesController(SalesInquiryDao salesInquiryDao)
    {
        this.salesInquiryDao = salesInquiryDao;
    }

    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    public SalesInquiry submitInquiry(@RequestBody SalesInquiry inquiry)
    {
        try
        {
            // validate required fields
            if (inquiry.getContactName() == null || inquiry.getContactName().trim().isEmpty())
            {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Contact name is required");
            }

            if (inquiry.getCompanyName() == null || inquiry.getCompanyName().trim().isEmpty())
            {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Company name is required");
            }

            if (inquiry.getEmail() == null || inquiry.getEmail().trim().isEmpty())
            {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
            }

            if (inquiry.getMessage() == null || inquiry.getMessage().trim().isEmpty())
            {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Message is required");
            }

            // create the sales inquiry
            SalesInquiry createdInquiry = salesInquiryDao.create(inquiry);

            if (createdInquiry == null)
            {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create sales inquiry");
            }

            return createdInquiry;
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
