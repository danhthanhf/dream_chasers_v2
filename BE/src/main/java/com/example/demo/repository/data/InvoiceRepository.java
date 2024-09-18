package com.example.demo.repository.data;

import com.example.demo.dto.InvoiceDTO;
import com.example.demo.dto.InvoiceStatisticDTO;
import com.example.demo.entity.data.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {
    @Query("SELECT new com.example.demo.dto.InvoiceDTO(i.id, i.date, i.total, i.content, i.method, new com.example.demo.dto.UserStatisticDTO(u.email, u.firstName, u.lastName, u.avatar)) FROM Invoice i JOIN i.user u WHERE i.isDelete = false")
    Page<InvoiceDTO> findAllInvoicesWithSelectedUserFields(Pageable pageable);

    @Query("SELECT new com.example.demo.dto.InvoiceDTO(i.id, i.date, i.total, i.content, i.method, new com.example.demo.dto.UserStatisticDTO(u.email, u.firstName, u.lastName, u.avatar)) FROM Invoice i JOIN i.user u WHERE i.isDelete = true")
    Page<InvoiceDTO> findAllIDeleteInvoicesWithSelectedUserFields(Pageable pageable);

    @Query("select new com.example.demo.dto.InvoiceDTO(i.id, i.date, i.total, i.content, i.method, new com.example.demo.dto.UserStatisticDTO(u.email, u.firstName, u.lastName, u.avatar)) from Invoice i JOIN i.user u WHERE function('YEAR', i.date) = ?3 and function('MONTH', i.date) = ?2 and function('DAY', i.date) = ?1")
    Page<InvoiceDTO> findAllByDate(int day, int month, int year, Pageable pageable);

    @Query("select new com.example.demo.dto.InvoiceDTO(i.id, i.date, i.total, i.content, i.method, new com.example.demo.dto.UserStatisticDTO(u.email, u.firstName, u.lastName, u.avatar)) from Invoice i JOIN i.user u WHERE i.date between ?1 and ?2")
    Page<InvoiceDTO> findAllByDateBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);

    @Override
    Page<Invoice> findAll(@NonNull Pageable pageable);

    @Query("select new com.example.demo.dto.InvoiceDTO(i.id, i.date, i.total, i.content, i.method, new com.example.demo.dto.UserStatisticDTO(u.email, u.firstName, u.lastName, u.avatar)) from Invoice i JOIN i.user u WHERE (u.firstName like %?1% or u.lastName like %?1%) and i.isDelete = false")
    Page<Invoice> findAllByUserFirstNameContainingOrLastNameContaining(String name, Pageable pageable);

    @Query("SELECT COUNT(i) FROM Invoice i WHERE MONTH(i.date) = :month AND YEAR(i.date) = :year")
    int countInvoicesCreatedInMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT SUM(i.total) FROM Invoice i WHERE MONTH(i.date) = :month AND YEAR(i.date) = :year")
    Long sumInvoiceTotalInMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT NEW com.example.demo.dto.InvoiceStatisticDTO(i.id, i.date, i.method, i.total, i.content, new com.example.demo.dto.UserStatisticDTO(u.id, u.email, u.firstName, u.lastName, u.avatar)) FROM Invoice i JOIN i.user u WHERE MONTH(i.date) = :month AND YEAR(i.date) = :year")
    Page<InvoiceStatisticDTO> findInvoicesCreatedInMonth(@Param("month") int month, @Param("year") int year, Pageable pageable);
}
