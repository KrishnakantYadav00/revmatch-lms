import Student from '../models/Student.js';
import Instructor from '../models/Instructor.js';

export const getProfile = async (req, res) => {
    try {
        const model = req.user.role === 'student' ? Student : Instructor;
        const profile = await model.findOne({ user: req.user.id }).populate('user', 'email role');
        
        if (!profile) return res.status(404).json({ message: "Profile not found" });
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const model = req.user.role === 'student' ? Student : Instructor;
        const updatedProfile = await model.findOneAndUpdate(
            { user: req.user.id }, 
            { $set: req.body }, 
            { new: true }
        ).populate('user', 'email role');

        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};