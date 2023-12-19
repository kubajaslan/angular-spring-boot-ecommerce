package com.truesolution.ecommerceangularjava.dto;

import com.truesolution.ecommerceangularjava.entity.Address;
import com.truesolution.ecommerceangularjava.entity.Customer;
import com.truesolution.ecommerceangularjava.entity.Order;
import com.truesolution.ecommerceangularjava.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
