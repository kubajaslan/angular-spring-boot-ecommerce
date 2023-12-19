package com.truesolution.ecommerceangularjava.service;

import com.truesolution.ecommerceangularjava.dto.Purchase;
import com.truesolution.ecommerceangularjava.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
}
