package com.dreamchasers.recoverbe.repository;

import com.dreamchasers.recoverbe.entity.User.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {
    Page<Invoice> findAllByUserEmail(String email, Pageable pageable);
}
