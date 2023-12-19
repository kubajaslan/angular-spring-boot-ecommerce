package com.truesolution.ecommerceangularjava.controller;

import com.truesolution.ecommerceangularjava.dto.Purchase;
import com.truesolution.ecommerceangularjava.dto.PurchaseResponse;
import com.truesolution.ecommerceangularjava.service.CheckoutService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {
    private CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase) {
        return checkoutService.placeOrder(purchase);
    }

}
