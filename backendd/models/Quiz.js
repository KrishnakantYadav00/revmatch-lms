import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true } // Index of the correct option
});

const quizSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    timerMinutes: { type: Number, required: true },
    questions: [questionSchema]
}, { timestamps: true });

export default mongoose.model('Quiz', quizSchema);
