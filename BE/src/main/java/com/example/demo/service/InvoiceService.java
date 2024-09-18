package com.example.demo.service;

import com.example.demo.dto.InvoiceDTO;
import com.example.demo.dto.ResponseObject;
import com.example.demo.dto.UserDTO;
import com.example.demo.entity.data.Course;
import com.example.demo.entity.data.Invoice;
import com.example.demo.entity.data.MethodPayment;
import com.example.demo.entity.user.User;
import com.example.demo.repository.data.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;

    public ResponseObject searchByName(String name, int page, int size) {
        return ResponseObject.builder().status(HttpStatus.OK).content(invoiceRepository.findAllByUserFirstNameContainingOrLastNameContaining(name, PageRequest.of(page, size))).build();
    }

    public ResponseObject softDelete(int id) {
        var invoice = invoiceRepository.findById(id).orElse(null);
        if (invoice == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Invoice not found").build();
        }
        invoice.setDelete(true);
        invoiceRepository.save(invoice);
        return ResponseObject.builder()
                .status(HttpStatus.OK)
                .mess("Deleted successfully")
                .content(invoiceRepository.findAllInvoicesWithSelectedUserFields(PageRequest.of(0,5)))
                        .build();
    }

    public ResponseObject restoreInvoice(int id) {
        var invoice = invoiceRepository.findById(id).orElse(null);
        if (invoice == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST)
                    .mess("Invoice not found")
                    .content(invoiceRepository.findAllIDeleteInvoicesWithSelectedUserFields(PageRequest.of(0, 5)))
                    .build();
        }
        invoice.setDelete(false);
        invoiceRepository.save(invoice);
        return ResponseObject.builder().status(HttpStatus.OK).mess("Restore successfully").content(invoiceRepository.findAllIDeleteInvoicesWithSelectedUserFields(PageRequest.of(0, 5))).build();
    }
    public ResponseObject getAll(int page, int size) {
//            var invoices = invoiceRepository.findAll(PageRequest.of(page, size));
//            var invoiceDTOs = invoices.stream().map(invoice -> InvoiceDTO.builder()
//                            .id(invoice.getId())
//                            .date(invoice.getDate())
//                            .total(invoice.getTotal())
//                            .content(invoice.getContent())
//                            .user(UserDTO.builder()
//                                    .email(invoice.getUser().getEmail())
//                                    .firstName(invoice.getUser().getFirstName())
//                                    .lastName(invoice.getUser().getLastName())
//                                    .avatar(invoice.getUser().getAvatar())
//                                    .build())
//                            .course(invoice.getCourse())
//                            .build())
//                    .toList(); // return immutable list
//                    .collect(Collectors.toList()); return mutable list
        return ResponseObject.builder().status(HttpStatus.OK).content(invoiceRepository.findAllInvoicesWithSelectedUserFields(PageRequest.of(page, size))).build() ;
    }
    public ResponseObject getAllDelete(int page, int size) {
        return ResponseObject.builder().status(HttpStatus.OK).content(invoiceRepository.findAllIDeleteInvoicesWithSelectedUserFields(PageRequest.of(page, size))).build() ;
    }
    public void saveForUser(User user, Course course, MethodPayment methodPayment) {
        Invoice invoice = Invoice.builder()
                .user(user)
                .date(LocalDateTime.now())
                .method(methodPayment)
                .content("Enroll for course " + course.getTitle())
                .course(course)
                .total(course.getPrice())
                .build();
         invoiceRepository.save(invoice);
    }

    public ResponseObject getByDateRange(String start, String end, int page, int size) {
        LocalDateTime startDate = LocalDateTime.parse(start);
        Page<InvoiceDTO> invoices = null;
        if(Objects.equals(start, end)) {
            int day = startDate.getDayOfMonth();
            int month = startDate.getMonthValue();
            int year = startDate.getYear();
             invoices = invoiceRepository.findAllByDate(day, month, year, PageRequest.of(page, size));
        }
        else {
                LocalDateTime endDate = LocalDateTime.parse(end);
                invoices = invoiceRepository.findAllByDateBetween(startDate, endDate, PageRequest.of(page, size));
        }
        return ResponseObject.builder().status(HttpStatus.OK).content(invoices).build();
    }

}
