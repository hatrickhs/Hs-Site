//package com.HS.Service.ServiceImpl;
//
//import com.HS.Repository.OrderRepository;
//import com.HS.Repository.SellerReportRepository;
//import com.HS.Service.Service.SellerReportService;
//import com.HS.domine.PaymentStatus;
//import com.HS.modal.Seller;
//import com.HS.modal.SellerReport;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//public class
//SellerReportServiceImpl implements SellerReportService {
//
//    private final SellerReportRepository sellerReportRepository;
//    private final OrderRepository orderRepository;
//
////    @Override
////    public SellerReport getSellerReport(Seller seller) {
////        SellerReport sr=sellerReportRepository.findBySellerId(seller.getId());
////
////        if (sr==null){
////            SellerReport newReport=new SellerReport();
////            newReport.setSeller(seller);
////            return sellerReportRepository.save(newReport);
////        }
////        return sr;
////    }
//
//    @Override
//    public SellerReport getSellerReport(Seller seller) {
//
//        Long sellerId = seller.getId();
//
//        SellerReport sr = sellerReportRepository.findBySellerId(sellerId);
//
//        if (sr == null) {
//            sr = new SellerReport();
//            sr.setSeller(seller);
//        }
//
//        Long totalSales = orderRepository.getTotalSales(sellerId);
//        Integer totalOrders = orderRepository.getTotalOrders(sellerId);
//        Long totalTax = orderRepository.getTotalTax(sellerId);
//        Integer cancelOrders = orderRepository.getCanceledOrders(sellerId);
//        Integer totalTransaction =orderRepository.getTotalTransactions(sellerId);
//        Long totalRefunds = orderRepository.getTotalRefunds(PaymentStatus.REFUNDED);
//
//        totalSales = totalSales != null ? totalSales : 0L;
//        totalOrders = totalOrders != null ? totalOrders : 0;
//        totalTax = totalTax != null ? totalTax : 0L;
//        cancelOrders = cancelOrders != null ? cancelOrders : 0;
//        totalRefunds = totalRefunds != null ? totalRefunds : 0L;
////        totalTransaction = totalTransaction != null ? totalTransaction : 0L;
//
//
//
//        long netEarnings = totalSales - totalTax - totalRefunds;
//
//        sr.setTotalSales(totalSales);
//        sr.setTotalOrders(totalOrders);
//        sr.setTotalTax(totalTax);
//        sr.setCanceledOrders(cancelOrders);
//        sr.setTotalRefunds(totalRefunds);
//        sr.setTotalTransactions(totalTransaction);
//        sr.setNetEarnings(netEarnings);
//
//        return sellerReportRepository.save(sr);
//    }
//
//    @Override
//    public SellerReport updateSellerReport(SellerReport sellerReport) {
//        return sellerReportRepository.save(sellerReport);
//    }
//}

package com.HS.Service.ServiceImpl;

import com.HS.Repository.OrderItemRepository;
import com.HS.Repository.SellerReportRepository;
import com.HS.Service.Service.SellerReportService;
import com.HS.domine.PaymentStatus;
import com.HS.modal.Seller;
import com.HS.modal.SellerReport;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SellerReportServiceImpl implements SellerReportService {

    private final SellerReportRepository sellerReportRepository;
    private final OrderItemRepository orderItemRepository;

    @Override
    public SellerReport getSellerReport(Seller seller) {

        Long sellerId = seller.getId();

        // get or create report
        SellerReport sr = sellerReportRepository.findBySellerId(sellerId);

        if (sr == null) {
            sr = new SellerReport();
            sr.setSeller(seller);
        }

        // 🔥 TOTAL SALES (REAL SOURCE = ORDER ITEM)
        Long totalSales = orderItemRepository.getTotalSales(sellerId);

        // 🔥 TOTAL ORDERS
        Integer totalOrders = orderItemRepository.getTotalOrders(sellerId);

        // 🔥 CANCELLED ORDERS
        Integer cancelOrders = orderItemRepository.getCanceledOrders(sellerId);

        Long totalRefunds = orderItemRepository.getTotalRefunds(PaymentStatus.REFUNDED);

        Double totalTax = orderItemRepository.getTotalTax(sellerId);

        Integer totalTransactions = orderItemRepository.getTotalTransactions(sellerId);



        // null safety
        totalSales = totalSales != null ? totalSales : 0L;
        totalOrders = totalOrders != null ? totalOrders : 0;
        cancelOrders = cancelOrders != null ? cancelOrders : 0;
        totalRefunds = totalRefunds != null ? totalRefunds : 0L;
        totalTax = totalTax != null ? totalTax : 0.0;
        sr.setTotalTransactions(totalTransactions);
        totalTransactions = totalTransactions != null ? totalTransactions : 0;

        // 🔥 NET EARNINGS (CORRECT FORMULA)
        long netEarnings = totalSales - totalRefunds;

        // set values
        sr.setTotalSales(totalSales);
        sr.setTotalOrders(totalOrders);
        sr.setCanceledOrders(cancelOrders);
        sr.setTotalRefunds(totalRefunds);
        sr.setNetEarnings(netEarnings);
        sr.setTotalEarnings(netEarnings);
        sr.setTotalTax(totalTax.longValue());

        return sellerReportRepository.save(sr);
    }

    @Override
    public SellerReport updateSellerReport(SellerReport sellerReport) {
        return sellerReportRepository.save(sellerReport);
    }
}