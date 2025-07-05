package com.danhthanhf.distantclass.service;

import com.danhthanhf.distantclass.entity.CourseKit.Course;
import com.danhthanhf.distantclass.entity.User.Invoice;
import com.danhthanhf.distantclass.entity.User.User;
import com.danhthanhf.distantclass.common.enums.MethodPayment;
import com.danhthanhf.distantclass.common.response.ResponseObject;
import com.danhthanhf.distantclass.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;

    public ResponseObject searchByEmail(String email, int page, int size) {
        return ResponseObject.builder().status(HttpStatus.OK).content(invoiceRepository.findAllByUserEmail(email, PageRequest.of(page, size))).build();
    }

    public ResponseObject softDelete(UUID id) {
        var invoice = invoiceRepository.findById(id).orElse(null);
        if (invoice == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("Invoice not found").build();
        }
        invoice.setDeleted(true);
        invoiceRepository.save(invoice);
        return ResponseObject.builder()
                .status(HttpStatus.OK)
                .message("Deleted successfully")
                .build();
    }

//    publicApi ResponseObject restoreInvoice(UUID id) {
//        var invoice = invoiceRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Invoice not found"));
//
//        invoice.setDeleted(false);
//        invoiceRepository.save(invoice);
//        return ResponseObject.builder().status(HttpStatus.OK).message("Restore successfully").content(invoiceRepository.findAllIDeleteInvoicesWithSelectedUserFields(PageRequest.of(0, 5))).build();
//    }


    public void saveForUser(User user, Course course, MethodPayment methodPayment) {
        Invoice invoice = Invoice.builder()
                .user(user)
                .method(methodPayment)
                .content("Enroll for course " + course.getTitle())
                .course(course)
                .total(course.getPrice().getPrice())
                .build();
        invoiceRepository.save(invoice);
    }

//    publicApi ResponseObject getByDateRange(String start, String end, int page, int size) {
//        LocalDateTime startDate = LocalDateTime.parse(start);
//        Page<InvoiceDTO> invoices = null;
//        if(Objects.equals(start, end)) {
//            int day = startDate.getDayOfMonth();
//            int month = startDate.getMonthValue();
//            int year = startDate.getYear();
//            invoices = invoiceRepository.findAllByDate(day, month, year, PageRequest.of(page, size));
//        }
//        else {
//            LocalDateTime endDate = LocalDateTime.parse(end);
//            invoices = invoiceRepository.findAllByDateBetween(startDate, endDate, PageRequest.of(page, size));
//        }
//        return ResponseObject.builder().status(HttpStatus.OK).content(invoices).build();
//    }

}
