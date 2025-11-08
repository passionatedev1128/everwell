import express from 'express';
import { getAllFaqs } from '../controllers/faqController.js';

const router = express.Router();

// FAQ routes are public
router.get('/', getAllFaqs);

export default router;

