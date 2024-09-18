
package com.example.demo.service;

import com.example.demo.dto.StatisticsDTO;
import com.example.demo.entity.data.Course;
import com.example.demo.entity.data.Invoice;
import com.example.demo.entity.user.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.data.CourseRepository;
import com.example.demo.repository.data.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class StatisticsService {
    private final CourseRepository courseRepository;

    private final InvoiceRepository invoiceRepository;

    private final UserRepository userRepository;

    @Autowired
    public StatisticsService(CourseRepository courseRepository, InvoiceRepository invoiceRepository, UserRepository userRepository) {
        this.courseRepository = courseRepository;
        this.invoiceRepository = invoiceRepository;
        this.userRepository = userRepository;
    }

    public StatisticsDTO getMonthlyStatistics(int month, int year, int page, int size) {
        StatisticsDTO statistics = StatisticsDTO.builder()
                .coursesCreated(courseRepository.findCoursesCreatedInMonth(month, year, PageRequest.of(0, Integer.MAX_VALUE)))
                .invoicesCreated(invoiceRepository.findInvoicesCreatedInMonth(month, year, PageRequest.of(0, Integer.MAX_VALUE)))
                .usersRegistered(userRepository.findUsersRegisteredInMonth(month, year, PageRequest.of(0, Integer.MAX_VALUE)))
                .build();
        Long invoiceTotal = invoiceRepository.sumInvoiceTotalInMonth(month, year);
        statistics.setInvoiceTotal(invoiceTotal != null ? invoiceTotal : 0);
        return statistics;
    }
}
