package com.SmartSpend.Transaction_Service.Transaction_Service.Repository;

import com.SmartSpend.Transaction_Service.Transaction_Service.Model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserIdOrderByDateDesc(Long userId);

    List<Transaction> findByUserIdAndCategoryIgnoreCase(Long userId, String category);
}
