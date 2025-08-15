import { body, param } from 'express-validator';

// Validation for creating users
export const validateCreateUsers = [
  body('name')
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be a string between 1 and 255 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
];

// Validation for updating users
export const validateUpdateUsers = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
  body('name')
    .optional()
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be a string between 1 and 255 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
];

// Validation for getting users by ID
export const validateGetUsersById = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
];
