package com.clothingstore.controller;

import com.clothingstore.constants.ApiRoutes;
import com.clothingstore.dto.DailySalesDTO;
import com.clothingstore.dto.SalesByCategoryDTO;
import com.clothingstore.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(ApiRoutes.STATS)
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/sales/today-by-category")
    public List<SalesByCategoryDTO> todayByCategory() {
        return statsService.salesTodayByCategory();
    }

    @GetMapping("/sales/month-by-category")
    public List<SalesByCategoryDTO> monthByCategory() {
        return statsService.salesMonthByCategory();
    }

    @GetMapping("/sales/daily")
    public List<DailySalesDTO> daily(@RequestParam(defaultValue = "30") int days) {
        return statsService.dailySales(days);
    }
}
