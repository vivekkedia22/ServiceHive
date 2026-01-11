import { Router } from 'express';
import { createBid, getBidsByGigId, getMyBids } from '../controllers/bid.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateCreateBid } from '../validation/bid.validation';
import { validationMiddleware } from '../middlewares/validation.middleware';

const router = Router();

router.post('/bids', authMiddleware, validateCreateBid, validationMiddleware, createBid);
router.get('/bids', authMiddleware, getMyBids);
router.get('/bids/:gigId', authMiddleware, getBidsByGigId);

export default router;