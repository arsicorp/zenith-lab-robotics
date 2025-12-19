package com.zenithlab.data;

import com.zenithlab.models.SalesInquiry;

import java.util.List;

public interface SalesInquiryDao
{
    SalesInquiry create(SalesInquiry inquiry);
    List<SalesInquiry> getAllSalesInquiries();
}
