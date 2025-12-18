import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import Student from './models/Student.js';
import Department from './models/Department.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['https://end-clgmanagementsystem-react.netlify.app', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
    console.log('Database:', mongoose.connection.db.databaseName);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

mongoose.connection.on('error', (error) => {
  console.error('MongoDB runtime error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'College Management System API' });
});

app.get('/test-db', async (req, res) => {
  try {
    const testStudent = new Student({
      name: 'Test Student',
      email: 'test@example.com',
      course: 'Test Course',
      year: '1st Year'
    });
    await testStudent.save();
    const count = await Student.countDocuments();
    res.json({ message: 'Database test successful', studentCount: count });
  } catch (error) {
    res.status(500).json({ message: 'Database test failed', error: error.message });
  }
});

app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ message: 'Internal server error', error: error.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});