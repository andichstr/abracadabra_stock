package com.clothingstore.service;

import com.clothingstore.dto.DailySalesDTO;
import com.clothingstore.dto.SalesByCategoryDTO;
import com.clothingstore.repository.SaleItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final SaleItemRepository saleItemRepository;

    @Transactional(readOnly = true)
    public List<SalesByCategoryDTO> salesTodayByCategory() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        return saleItemRepository.findSalesByCategory(start, start.plusDays(1));
    }

    @Transactional(readOnly = true)
    public List<SalesByCategoryDTO> salesMonthByCategory() {
        LocalDateTime start = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        return saleItemRepository.findSalesByCategory(start, start.plusMonths(1));
    }

    @Transactional(readOnly = true)
    public List<DailySalesDTO> dailySales(int days) {
        LocalDateTime from = LocalDate.now().minusDays(Math.min(days, 90) - 1L).atStartOfDay();
        return saleItemRepository.findDailySales(from);
    }
}
