package com.HS.Service.Service;

import com.HS.modal.Order;
import com.HS.modal.Seller;
import com.HS.modal.Transaction;

import java.util.List;

public interface TransactionService {

    Transaction createTransaction(Order order);
    List<Transaction> getTransactionsBySellerId(Seller seller);
    List<Transaction> getAllTransaction();
}
