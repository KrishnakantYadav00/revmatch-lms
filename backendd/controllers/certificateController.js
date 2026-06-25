import PDFDocument from 'pdfkit';
import Course from '../models/Course.js';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';

export const generateCertificate = async (req, res) => {
    try {
        const { courseId, studentId } = req.body;
        const course = await Course.findById(courseId);
        const student = await User.findById(studentId);

        if (!course || !student) {
            return res.status(404).json({ message: 'Course or Student not found' });
        }

        const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });

        const filename = `certificate-${studentId}-${courseId}.pdf`;
        const filepath = path.join('uploads', filename);

        doc.pipe(fs.createWriteStream(filepath));

        // Draw certificate background/border
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();

        doc.fontSize(30).text('Certificate of Completion', { align: 'center' });
        doc.moveDown(2);
        doc.fontSize(20).text(`This is to certify that`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(25).text(`${student.email}`, { align: 'center', underline: true });
        doc.moveDown();
        doc.fontSize(20).text(`has successfully completed the course`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(25).text(`${course.title}`, { align: 'center', underline: true });
        
        doc.end();

        res.status(200).json({ message: 'Certificate generated', fileUrl: `/uploads/${filename}` });
    } catch (error) {
        res.status(500).json({ message: 'Error generating certificate', error: error.message });
    }
};
