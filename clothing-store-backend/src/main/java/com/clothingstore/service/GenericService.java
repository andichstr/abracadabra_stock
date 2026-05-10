package com.clothingstore.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface GenericService<RESPONSE, REQUEST, ID> {

    Page<RESPONSE> findAll(Pageable pageable);

    RESPONSE findById(ID id);

    RESPONSE create(REQUEST request);

    default RESPONSE update(ID id, REQUEST request) {
        throw new UnsupportedOperationException("Update not supported for this resource");
    }

    default void delete(ID id) {
        throw new UnsupportedOperationException("Delete not supported for this resource");
    }
}
