package com.clothingstore.controller;

import com.clothingstore.constants.ApiRoutes;
import com.clothingstore.dto.PageResponse;
import com.clothingstore.dto.SaleRequestDTO;
import com.clothingstore.dto.SaleResponseDTO;
import com.clothingstore.service.SaleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequestMapping(ApiRoutes.SALES)
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;

    @GetMapping
    public PageResponse<SaleResponseDTO> getAll(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false) BigDecimal amountMin,
            @RequestParam(required = false) BigDecimal amountMax,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int pageSize
    ) {
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by(Sort.Direction.DESC, "saleDate"));
        return PageResponse.of(saleService.findAll(dateFrom, dateTo, amountMin, amountMax, pageable));
    }

    @GetMapping("/{id}")
    public SaleResponseDTO getById(@PathVariable Long id) {
        return saleService.findById(id);
    }

    @PostMapping
    public ResponseEntity<SaleResponseDTO> create(@Valid @RequestBody SaleRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(saleService.create(request));
    }
}
