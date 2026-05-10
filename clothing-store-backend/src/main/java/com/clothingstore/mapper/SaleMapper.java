package com.clothingstore.mapper;

import com.clothingstore.dto.SaleItemDTO;
import com.clothingstore.dto.SaleResponseDTO;
import com.clothingstore.model.Sale;
import com.clothingstore.model.SaleItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SaleMapper {

    SaleResponseDTO toResponse(Sale sale);

    @Mapping(source = "productVariant.id",           target = "variantId")
    @Mapping(source = "productVariant.product.id",   target = "productId")
    @Mapping(source = "productVariant.product.name", target = "productName")
    @Mapping(source = "productVariant.size",         target = "size")
    @Mapping(source = "productVariant.color",        target = "color")
    @Mapping(target = "subtotal",
             expression = "java(item.getUnitPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity())))")
    SaleItemDTO toItemDTO(SaleItem item);
}
