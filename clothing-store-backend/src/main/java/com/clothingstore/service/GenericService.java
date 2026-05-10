package com.clothingstore.service;

import java.util.List;

public interface GenericService<RESPONSE, REQUEST, ID> {

    List<RESPONSE> findAll();

    RESPONSE findById(ID id);

    RESPONSE create(REQUEST request);

    default RESPONSE update(ID id, REQUEST request) {
        throw new UnsupportedOperationException("Update not supported for this resource");
    }

    default void delete(ID id) {
        throw new UnsupportedOperationException("Delete not supported for this resource");
    }
}
