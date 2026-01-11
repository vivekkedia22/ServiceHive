import { body } from 'express-validator';

export interface CreateGigInput {
  title: string;
  description: string;
  budget: number;
  ownerId: string;
}

export const validateCreateGig = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('budget').isNumeric().withMessage('Budget must be a number'),
];