import mongoose from 'mongoose';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Instructor from '../models/Instructor.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// ==========================================
// REGISTER (With Transaction & Roles)
// ==========================================
export const register = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { email, password, role, fullName } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 1. Create User
        const newUser = new User({ email, password: hashedPassword, role });
        const savedUser = await newUser.save({ session });

        // 2. Create linked Profile
        if (role === 'student') {
            await Student.create([{ user: savedUser._id, fullName }], { session });
        } else if (role === 'instructor') {
            await Instructor.create([{ user: savedUser._id, fullName }], { session });
        } else {
            throw new Error("Invalid role specified");
        }

        await session.commitTransaction();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ error: error.message });
    } finally {
        session.endSession();
    }
};

// ==========================================
// LOGIN
// ==========================================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, user: { id: user._id, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==========================================
// REFRESH TOKEN (Placeholder)
// ==========================================
export const refresh = async (req, res) => {
    // Implement your refresh token logic here
    res.status(200).json({ message: "Refresh token endpoint hit" });
};

// ==========================================
// LOGOUT (Placeholder)
// ==========================================
export const logout = async (req, res) => {
    // Implement your logout logic here (e.g., clearing cookies)
    res.status(200).json({ message: "Logged out successfully" });
};

// ==========================================
// FORGOT PASSWORD
// ==========================================
export const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        // Send Email
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
            port: process.env.SMTP_PORT || 2525,
            auth: {
                user: process.env.SMTP_USER || 'user',
                pass: process.env.SMTP_PASS || 'pass'
            }
        });

        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

        const message = `You requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;

        await transporter.sendMail({
            from: 'noreply@revmatchlms.com',
            to: user.email,
            subject: 'Password Reset Token',
            text: message
        });

        res.status(200).json({ message: 'Email sent' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==========================================
// RESET PASSWORD
// ==========================================
export const resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==========================================
// VERIFY EMAIL (Placeholder for demonstration)
// ==========================================
export const verifyEmail = async (req, res) => {
    try {
        const user = await User.findOne({ emailVerificationToken: req.params.token });
        if (!user) return res.status(400).json({ message: "Invalid token" });

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        await user.save();

        res.status(200).json({ message: "Email verified" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};