// server/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'instructor'], required: true },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String
}, { timestamps: true });

export default mongoose.model('User', userSchema);