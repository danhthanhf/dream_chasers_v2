package com.dreamchasers.recoverbe.controller.Private;

import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.service.StatisticService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/private/statistic")
@RequiredArgsConstructor
public class StatisticController {
    private final StatisticService statisticService;

    @GetMapping("/all")
    public ResponseEntity<ResponseObject> getStatistic() {
        var res = statisticService.getStatistic();
        return ResponseEntity.status(res.getStatus()).body(res);
    }

    @GetMapping("")
    public ResponseEntity<ResponseObject> getStatisticByDateTimeAndType(@RequestParam String type, @RequestParam String dateTime) {
        var res = statisticService.getStatisticByDateTimeAndType(type, dateTime);
        return ResponseEntity.status(res.getStatus()).body(res);
    }
}
