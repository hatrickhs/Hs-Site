package com.HS.request;

import com.HS.modal.Address;
import com.HS.modal.Cart;
import lombok.Data;

@Data
public class CreatePaymentRequest {
    private Address shippingAddress;
    private Cart cart;
}

