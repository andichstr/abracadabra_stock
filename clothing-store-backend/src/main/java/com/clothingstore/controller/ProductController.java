package com.clothingstore.controller;

import com.clothingstore.constants.ApiRoutes;
import com.clothingstore.dto.PageResponse;
import com.clothingstore.dto.ProductRequestDTO;
import com.clothingstore.dto.ProductResponseDTO;
import com.clothingstore.dto.ProductVariantScanDTO;
import com.clothingstore.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping(ApiRoutes.PRODUCTS)
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public PageResponse<ProductResponseDTO> getAll(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false) BigDecimal priceMin,
            @RequestParam(required = false) BigDecimal priceMax,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) String color,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int pageSize
    ) {
        Pageable pageable = PageRequest.of(page, pageSize);
        return PageResponse.of(
                productService.findAll(categoryId, dateFrom, dateTo, priceMin, priceMax, size, color, pageable)
        );
    }

    @GetMapping("/variants/qr/{qrCode}")
    public ProductVariantScanDTO getVariantByQrCode(@PathVariable String qrCode) {
        return productService.findVariantByQrCode(qrCode);
    }

    @GetMapping("/qr/{qrCode}")
    public ProductResponseDTO getByQrCode(@PathVariable String qrCode) {
        return productService.findByQrCode(qrCode);
    }

    @GetMapping("/{id}")
    public ProductResponseDTO getById(@PathVariable Long id) {
        return productService.findById(id);
    }

    @PostMapping
    public ResponseEntity<ProductResponseDTO> create(@Valid @RequestBody ProductRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.create(dto));
    }

    @PutMapping("/{id}")
    public ProductResponseDTO update(@PathVariable Long id, @Valid @RequestBody ProductRequestDTO dto) {
        return productService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
