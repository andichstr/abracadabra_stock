package com.clothingstore.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @PostMapping
    public ResponseEntity<Map<String, String>> upload(@RequestParam("image") MultipartFile file) throws IOException {
        if (file.isEmpty() || !file.getContentType().startsWith("image/")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Solo se permiten imágenes."));
        }

        String original = file.getOriginalFilename();
        String ext = (original != null && original.contains("."))
                ? original.substring(original.lastIndexOf('.'))
                : ".jpg";

        String filename = UUID.randomUUID() + ext;
        Path dest = Paths.get(uploadDir).toAbsolutePath().resolve(filename);
        Files.createDirectories(dest.getParent());
        file.transferTo(dest);

        return ResponseEntity.ok(Map.of("imageUrl", "/uploads/" + filename));
    }
}
