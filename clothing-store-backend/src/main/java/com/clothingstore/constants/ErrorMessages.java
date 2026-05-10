package com.clothingstore.constants;

public final class ErrorMessages {
    private ErrorMessages() {}

    public static final String CATEGORY_NOT_FOUND   = "Category not found with id: ";
    public static final String PRODUCT_NOT_FOUND    = "Product not found with id: ";
    public static final String PRODUCT_NOT_FOUND_QR = "Product not found with QR code: ";
    public static final String PRODUCT_HAS_SALES    = "Cannot delete product with associated sales. Product id: ";
    public static final String SALE_NOT_FOUND       = "Sale not found with id: ";
    public static final String VARIANT_NOT_FOUND    = "Variant not found with id: ";
    public static final String VARIANT_NOT_FOUND_QR = "Variant not found with QR code: ";
    public static final String SALE_EMPTY_ITEMS     = "Sale must contain at least one item.";
    public static final String INSUFFICIENT_STOCK   = "Insufficient stock for '";
    public static final String ONLY_IMAGES_ALLOWED  = "Solo se permiten imágenes.";
}
