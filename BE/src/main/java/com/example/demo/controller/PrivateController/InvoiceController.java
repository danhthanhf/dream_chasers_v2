package com.example.demo.controller.PrivateController;

import com.example.demo.dto.ResponseObject;
import com.example.demo.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/private/invoice")

public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @GetMapping("/getAll")
    public ResponseEntity<ResponseObject> getAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size){
        var result = invoiceService.getAll(page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }
    @GetMapping("/getAllDeleted")
    public ResponseEntity<ResponseObject> getAllDeleted(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size){
        var result = invoiceService.getAllDelete(page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/getByDate")
    public ResponseEntity<ResponseObject> searchByDate(@RequestParam String start, @RequestParam String end, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size){
        var result = invoiceService.getByDateRange(start, end, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/search")
    public ResponseEntity<ResponseObject> search(@RequestParam String name, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size){
        var result = invoiceService.searchByName(name, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("delete/soft/{id}")
    public ResponseEntity<ResponseObject> delete(@PathVariable int id){
        var result = invoiceService.softDelete(id);
        return ResponseEntity.status(result.getStatus()).body(result);
    }
    @PutMapping("restore/{id}")
    public ResponseEntity<ResponseObject> restore(@PathVariable int id){
        var result = invoiceService.restoreInvoice(id);
        return ResponseEntity.status(result.getStatus()).body(result);
    }
}
