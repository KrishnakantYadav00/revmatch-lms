import Quiz from '../models/Quiz.js';
import Course from '../models/Course.js';

export const createQuiz = async (req, res) => {
    try {
        const { courseId, title, timerMinutes, questions } = req.body;
        const quiz = new Quiz({ course: courseId, title, timerMinutes, questions });
        await quiz.save();

        const course = await Course.findById(courseId);
        course.quizzes.push(quiz._id);
        await course.save();

        res.status(201).json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Error creating quiz', error: error.message });
    }
};

export const getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ course: req.params.courseId });
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quizzes', error: error.message });
    }
};

export const submitQuiz = async (req, res) => {
    try {
        const { answers } = req.body; // array of option indices
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        let score = 0;
        quiz.questions.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) score++;
        });

        res.status(200).json({ score, total: quiz.questions.length });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting quiz', error: error.message });
    }
};
