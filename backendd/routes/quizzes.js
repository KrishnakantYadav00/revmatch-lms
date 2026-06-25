import express from 'express';
import { createQuiz, getQuizzes, submitQuiz } from '../controllers/quizController.js';

const router = express.Router();

router.post('/', createQuiz);
router.get('/course/:courseId', getQuizzes);
router.post('/:id/submit', submitQuiz);

export default router;
