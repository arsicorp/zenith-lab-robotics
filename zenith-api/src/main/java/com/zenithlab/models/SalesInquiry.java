package com.zenithlab.models;

import java.time.LocalDateTime;

public class SalesInquiry
{
    private int inquiryId;
    private int productId;
    private String contactName;
    private String companyName;
    private String email;
    private String phone;
    private String message;
    private LocalDateTime inquiryDate;
    private String status;

    public SalesInquiry()
    {
    }

    public SalesInquiry(int inquiryId, int productId, String contactName, String companyName, String email, String phone, String message, LocalDateTime inquiryDate, String status)
    {
        this.inquiryId = inquiryId;
        this.productId = productId;
        this.contactName = contactName;
        this.companyName = companyName;
        this.email = email;
        this.phone = phone;
        this.message = message;
        this.inquiryDate = inquiryDate;
        this.status = status;
    }

    public int getInquiryId()
    {
        return inquiryId;
    }

    public void setInquiryId(int inquiryId)
    {
        this.inquiryId = inquiryId;
    }

    public int getProductId()
    {
        return productId;
    }

    public void setProductId(int productId)
    {
        this.productId = productId;
    }

    public String getContactName()
    {
        return contactName;
    }

    public void setContactName(String contactName)
    {
        this.contactName = contactName;
    }

    public String getCompanyName()
    {
        return companyName;
    }

    public void setCompanyName(String companyName)
    {
        this.companyName = companyName;
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

    public String getMessage()
    {
        return message;
    }

    public void setMessage(String message)
    {
        this.message = message;
    }

    public LocalDateTime getInquiryDate()
    {
        return inquiryDate;
    }

    public void setInquiryDate(LocalDateTime inquiryDate)
    {
        this.inquiryDate = inquiryDate;
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
