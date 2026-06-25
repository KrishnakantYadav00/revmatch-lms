import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    materials: [{ 
        title: String,
        fileUrl: String,
        uploadedAt: { type: Date, default: Date.now }
    }],
    studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }]
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
