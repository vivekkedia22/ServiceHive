import { body } from 'express-validator';

export interface CreateBidInput {
  gigId: string;
  freelancerId: string;
  message: string;
}

export const validateCreateBid = [
  body('gigId').notEmpty().withMessage('Gig ID is required'),
  body('message').notEmpty().withMessage('Message is required')
];