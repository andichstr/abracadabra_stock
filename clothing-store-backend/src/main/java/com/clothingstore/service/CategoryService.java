package com.clothingstore.service;

import com.clothingstore.constants.ErrorMessages;
import com.clothingstore.dto.CategoryRequestDTO;
import com.clothingstore.dto.CategoryResponseDTO;
import com.clothingstore.exception.ResourceNotFoundException;
import com.clothingstore.mapper.CategoryMapper;
import com.clothingstore.model.Category;
import com.clothingstore.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService implements GenericService<CategoryResponseDTO, CategoryRequestDTO, Long> {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public List<CategoryResponseDTO> findAll() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponseDTO findById(Long id) {
        return categoryRepository.findById(id)
                .map(categoryMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorMessages.CATEGORY_NOT_FOUND + id));
    }

    @Override
    public CategoryResponseDTO create(CategoryRequestDTO dto) {
        Category c = categoryMapper.toEntity(dto);
        return categoryMapper.toResponse(categoryRepository.save(c));
    }

    @Override
    public CategoryResponseDTO update(Long id, CategoryRequestDTO dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorMessages.CATEGORY_NOT_FOUND + id));
        categoryMapper.updateEntity(dto, category);
        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    @Override
    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException(ErrorMessages.CATEGORY_NOT_FOUND + id);
        }
        categoryRepository.deleteById(id);
    }
}
