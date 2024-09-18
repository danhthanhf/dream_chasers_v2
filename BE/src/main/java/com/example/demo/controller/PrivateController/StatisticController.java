package com.example.demo.controller.PrivateController;


import com.example.demo.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/private/statistic")
public class StatisticController {
    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("")
    public ResponseEntity<Object> getStatistic(@RequestParam("month") int month, @RequestParam("year") int year, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size){
        return ResponseEntity.status(HttpStatus.OK).body(statisticsService.getMonthlyStatistics(month, year, page, size));
    }

}
