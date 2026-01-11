import { Router } from 'express';
import { createGig, getGigs } from '../controllers/gig.controller';
import { validateCreateGig } from '../validation/gig.validation';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/gigs', authMiddleware, validateCreateGig, validationMiddleware, createGig);
router.get('/gigs', getGigs);

export default router;