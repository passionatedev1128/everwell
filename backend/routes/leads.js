import express from 'express';
import { submitGoalForm } from '../controllers/leadController.js';

const router = express.Router();

router.post('/goals', submitGoalForm);

export default router;


