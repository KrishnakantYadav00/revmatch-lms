import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';
import Course from '../models/Course.js';

// Create an assignment
export const createAssignment = async (req, res) => {
    try {
        const { courseId, title, description, dueDate } = req.body;
        const assignment = new Assignment({ course: courseId, title, description, dueDate });
        await assignment.save();

        const course = await Course.findById(courseId);
        course.assignments.push(assignment._id);
        await course.save();

        // Emit real-time notification
        req.io.emit('newAssignment', { courseId, title });

        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating assignment', error: error.message });
    }
};

// Get assignments for a course
export const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ course: req.params.courseId });
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assignments', error: error.message });
    }
};

// Submit an assignment
export const submitAssignment = async (req, res) => {
    try {
        const { studentId } = req.body;
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const submission = new Submission({
            assignment: req.params.id,
            student: studentId,
            fileUrl: `/uploads/${req.file.filename}`
        });
        await submission.save();

        const assignment = await Assignment.findById(req.params.id);
        assignment.submissions.push(submission._id);
        await assignment.save();

        res.status(201).json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Error submitting assignment', error: error.message });
    }
};

// Grade a submission
export const gradeSubmission = async (req, res) => {
    try {
        const { grade, feedback } = req.body;
        const submission = await Submission.findByIdAndUpdate(
            req.params.submissionId, 
            { grade, feedback }, 
            { new: true }
        );
        res.status(200).json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Error grading submission', error: error.message });
    }
};
