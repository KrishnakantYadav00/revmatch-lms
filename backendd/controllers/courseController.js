import Course from '../models/Course.js';

// Create a new course
export const createCourse = async (req, res) => {
    try {
        const { title, description, instructor } = req.body;
        const newCourse = new Course({ title, description, instructor });
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(500).json({ message: 'Error creating course', error: error.message });
    }
};

// Get all courses
export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('instructor', 'fullName email');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error: error.message });
    }
};

// Get course by ID
export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('instructor', 'fullName email')
            .populate('studentsEnrolled', 'fullName email')
            .populate('assignments')
            .populate('quizzes');
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching course', error: error.message });
    }
};

// Upload material to course
export const uploadMaterial = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const material = {
            title: req.body.title || req.file.originalname,
            fileUrl: `/uploads/${req.file.filename}`
        };

        course.materials.push(material);
        await course.save();

        res.status(200).json({ message: 'Material uploaded successfully', material });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading material', error: error.message });
    }
};

// Enroll in a course
export const enrollStudent = async (req, res) => {
    try {
        const { studentId } = req.body;
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        if (!course.studentsEnrolled.includes(studentId)) {
            course.studentsEnrolled.push(studentId);
            await course.save();
        }

        res.status(200).json({ message: 'Enrolled successfully', course });
    } catch (error) {
        res.status(500).json({ message: 'Error enrolling student', error: error.message });
    }
};
