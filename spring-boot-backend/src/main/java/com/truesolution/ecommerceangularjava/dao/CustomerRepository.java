package com.truesolution.ecommerceangularjava.dao;

import com.truesolution.ecommerceangularjava.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
