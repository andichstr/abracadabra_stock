package com.clothingstore.mapper;

import com.clothingstore.dto.CategoryRequestDTO;
import com.clothingstore.dto.CategoryResponseDTO;
import com.clothingstore.model.Category;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponseDTO toResponse(Category category);
    Category toEntity(CategoryRequestDTO dto);
    void updateEntity(CategoryRequestDTO dto, @MappingTarget Category category);
}
