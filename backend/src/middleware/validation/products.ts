import { body, param, query } from 'express-validator';

// Validation for creating products
export const validateCreateProducts = [
  body('name')
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be a string between 1 and 255 characters'),
];

// Validation for getting products by ID
export const validateGetProductsById = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
];

// Validation for pagination
export const validatePagination = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer'),
];

// Validation for updating products
export const validateUpdateProducts = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
  body('name')
    .optional()
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be a string between 1 and 255 characters'),
  body('description')
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage('Description must be a string with max 1000 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
];
