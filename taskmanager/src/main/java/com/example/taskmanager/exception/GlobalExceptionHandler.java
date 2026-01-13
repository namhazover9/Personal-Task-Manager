package com.example.taskmanager.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.InvalidDataAccessResourceUsageException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Validation errors (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    // Resource not found
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // Bad request custom
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<String> handleBadRequest(BadRequestException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    // Duplicate email/username (register)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        String message = "Dữ liệu đã tồn tại (email hoặc username trùng)";
        if (ex.getMessage() != null && ex.getMessage().contains("uk6dotkott2kjsp8vw4d0m25fb7")) {
            message = "Email đã được sử dụng";
        } else if (ex.getMessage() != null && ex.getMessage().contains("users_username_key")) {
            message = "Username đã được sử dụng";
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body(message); // 409 Conflict
    }

    // Lỗi database khác (ví dụ query lỗi do param)
    @ExceptionHandler(org.springframework.dao.InvalidDataAccessApiUsageException.class)
    public ResponseEntity<String> handleInvalidDataAccess(Exception ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Dữ liệu đầu vào không hợp lệ hoặc thiếu tham số");
    }

    // Lỗi chung khác (fallback)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneralException(Exception ex) {
        // Log đầy đủ ở server, nhưng frontend chỉ thấy message an toàn
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Có lỗi xảy ra, vui lòng thử lại sau");
    }

    @ExceptionHandler(InvalidDataAccessResourceUsageException.class)
    public ResponseEntity<String> handleInvalidDataAccessResourceUsage(InvalidDataAccessResourceUsageException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Tham số tìm kiếm không hợp lệ. Vui lòng kiểm tra lại keyword hoặc các bộ lọc.");
    }
}