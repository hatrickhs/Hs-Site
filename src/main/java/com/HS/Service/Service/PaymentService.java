package com.HS.Service.Service;

import com.HS.modal.Order;
import com.HS.modal.PaymentOrder;
import com.HS.modal.User;
import com.HS.request.CreatePaymentRequest;
import com.HS.response.PaymentLinkResponse;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;

import java.util.Set;

public interface PaymentService {
    PaymentOrder createOrder(User user, Set<Order> orders);

    PaymentOrder getPaymentOrderById(Long orderId) throws Exception;

    PaymentOrder getPaymentByPaymentId(String paymentLinkId) throws Exception;

    Boolean ProceedPaymentOrder(PaymentOrder paymentOrder, String paymentId, String paymentLinkId) throws Exception;

   //PaymentLink createRazorpayPaymentLink(User user, Long orderId, Long amount) throws Exception;

    PaymentLinkResponse createRazorpayPaymentLink(User user, Long orderId, Long amount) throws Exception;

    String createStripePaymentLink(User user, Long amount, Long orderId) throws Exception;



}
