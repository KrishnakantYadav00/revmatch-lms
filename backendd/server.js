import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import { protect } from './middleware/authMiddleware.js'
dotenv.config()
const app = express() 
connectDB()
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true

}))
app.use(express.json())
app.use(cookieParser())
app.get('/api/dashboard', protect, (req, res) => {
    // If the request passes 'protect', req.user will contain the decrypted user payload
    res.json({ 
        message: "🔓 Welcome to the secure dashboard!", 
        authenticatedUser: req.user 
    });
});
app.use('/api/auth',authRoutes)
const PORT = process.env.PORT || 5000;
app.listen(PORT ,()=>console.log(" The server is upp! at port "+PORT ))