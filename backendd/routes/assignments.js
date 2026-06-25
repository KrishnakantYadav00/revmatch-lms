import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { 
    createAssignment, 
    getAssignments, 
    submitAssignment, 
    gradeSubmission 
} from '../controllers/assignmentController.js';

const router = express.Router();

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.post('/', createAssignment);
router.get('/course/:courseId', getAssignments);
router.post('/:id/submit', upload.single('submission'), submitAssignment);
router.put('/submission/:submissionId/grade', gradeSubmission);

export default router;
