import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  console.log('Registration attempt:', req.body);
  try {
    const { name, email, password, phone, course, role } = req.body;
    
    if (!name || !email || !password) {
      console.log('Missing fields');
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    console.log('Checking existing user...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    console.log('Creating new user...');
    const user = new User({ 
      name, 
      email, 
      password, 
      phone: phone || '', 
      course: course || '', 
      role: role || 'student' 
    });
    console.log('Saving user...');
    await user.save();
    console.log('User saved successfully');

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Registration error details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check for admin credentials first
    if (email === 'harizzcollege@gmail.com' && password === 'harizz') {
      const token = jwt.sign({ userId: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        message: 'Admin login successful',
        token,
        user: { id: 'admin', name: 'Admin', email: email, role: 'admin' }
      });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;