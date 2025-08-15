import { body, param } from 'express-validator';

// Validation for creating book
export const validateCreateBook = [
  body('name')
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be a string between 1 and 255 characters'),
  // Add more validation rules as needed based on your model
];

// Validation for updating book
export const validateUpdateBook = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
  body('name')
    .optional()
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be a string between 1 and 255 characters'),
  // Add more validation rules as needed based on your model
];

// Validation for getting book by ID
export const validateGetBookById = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
];
