import express from 'express';
import multer from 'multer';
import { 
    createCourse, 
    getCourses, 
    getCourseById, 
    uploadMaterial, 
    enrollStudent 
} from '../controllers/courseController.js';
import fs from 'fs';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer storage setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.post('/', createCourse);
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/:id/upload', upload.single('material'), uploadMaterial);
router.post('/:id/enroll', enrollStudent);

export default router;
