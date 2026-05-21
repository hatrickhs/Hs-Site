package com.HS.Service.Service;

import com.HS.modal.Seller;
import com.HS.modal.SellerReport;

public interface SellerReportService {
    SellerReport getSellerReport(Seller seller);
    SellerReport updateSellerReport(SellerReport sellerReport);
}


