import mongoose from 'mongoose';

const instructorSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    bio: { type: String, default: '' },
    coursesCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

export default mongoose.model('Instructor', instructorSchema);