package com.clothingstore.mapper;

import com.clothingstore.dto.ProductRequestDTO;
import com.clothingstore.dto.ProductResponseDTO;
import com.clothingstore.dto.ProductVariantDTO;
import com.clothingstore.model.Product;
import com.clothingstore.model.ProductVariant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    ProductResponseDTO toResponse(Product product);

    ProductVariantDTO toVariantDTO(ProductVariant variant);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "qrCode", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "variants", ignore = true)
    Product toEntity(ProductRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "qrCode", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "variants", ignore = true)
    void updateEntity(ProductRequestDTO dto, @MappingTarget Product product);
}
