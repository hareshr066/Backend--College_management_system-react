import express from 'express';
import Student from '../models/Student.js';
import Course from '../models/Course.js';
import Faculty from '../models/Faculty.js';
import Department from '../models/Department.js';

const router = express.Router();

// Seed some default departments if none exist
const seedDepartments = async () => {
  try {
    const count = await Department.countDocuments();
    if (count === 0) {
      const defaultDepartments = [
        { name: 'Computer Science & Engineering', code: 'CSE', description: 'AI, Machine Learning, Software Development', head: 'Dr. Rajesh Kumar', established: 1995 },
        { name: 'Mechanical Engineering', code: 'ME', description: 'Robotics, Automation, Manufacturing', head: 'Dr. Amit Patel', established: 1990 },
        { name: 'Electrical Engineering', code: 'EE', description: 'Power Systems, Electronics, Control Systems', head: 'Dr. Vikram Singh', established: 1988 },
        { name: 'Civil Engineering', code: 'CE', description: 'Structural Design, Construction Management', head: 'Dr. Sneha Reddy', established: 1985 },
        { name: 'Electronics & Communication', code: 'ECE', description: 'VLSI, Embedded Systems, Telecommunications', head: 'Dr. Priya Sharma', established: 1992 },
        { name: 'Information Technology', code: 'IT', description: 'Web Development, Cloud Computing, Cybersecurity', head: 'Dr. Anjali Verma', established: 2000 }
      ];
      await Department.insertMany(defaultDepartments);
      console.log('Default departments seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding departments:', error);
  }
};

seedDepartments();

// Students routes
router.get('/students', async (req, res) => {
  try {
    console.log('Fetching students from database...');
    const students = await Student.find().sort({ createdAt: -1 });
    console.log('Found students:', students.length);
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/students', async (req, res) => {
  try {
    console.log('Received student data:', req.body);
    
    // Validate required fields
    const { name, email, course, year } = req.body;
    if (!name || !email || !course || !year) {
      return res.status(400).json({ message: 'Name, email, course, and year are required' });
    }

    const student = new Student(req.body);
    console.log('Created student object:', student.toObject());
    
    const savedStudent = await student.save();
    console.log('Student saved to database with ID:', savedStudent._id);
    
    // Verify it was saved by fetching it back
    const verification = await Student.findById(savedStudent._id);
    console.log('Verification - Student exists in DB:', !!verification);
    
    res.status(201).json(savedStudent);
  } catch (error) {
    console.error('Error saving student:', error.message);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Student with this email already exists' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

router.delete('/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Courses routes
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/courses', async (req, res) => {
  try {
    console.log('Received course data:', req.body);
    
    const { name, code, duration, fees } = req.body;
    if (!name || !code || !duration || !fees) {
      return res.status(400).json({ message: 'Name, code, duration, and fees are required' });
    }

    const course = new Course(req.body);
    const savedCourse = await course.save();
    console.log('Course saved with ID:', savedCourse._id);
    
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Error saving course:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Course with this code already exists' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

router.delete('/courses/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Faculty routes
router.get('/faculty', async (req, res) => {
  try {
    const faculty = await Faculty.find().sort({ createdAt: -1 });
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/faculty', async (req, res) => {
  try {
    console.log('Received faculty data:', req.body);
    
    const { name, email, department, designation } = req.body;
    if (!name || !email || !department || !designation) {
      return res.status(400).json({ message: 'Name, email, department, and designation are required' });
    }

    const faculty = new Faculty(req.body);
    const savedFaculty = await faculty.save();
    console.log('Faculty saved with ID:', savedFaculty._id);
    
    res.status(201).json(savedFaculty);
  } catch (error) {
    console.error('Error saving faculty:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Faculty with this email already exists' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

router.delete('/faculty/:id', async (req, res) => {
  try {
    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ message: 'Faculty deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Departments routes
router.get('/departments', async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/departments', async (req, res) => {
  try {
    console.log('Received department data:', req.body);
    
    const { name, code, description, head, established } = req.body;
    if (!name || !code) {
      return res.status(400).json({ message: 'Name and code are required' });
    }

    const department = new Department(req.body);
    console.log('Created department object:', department.toObject());
    
    const savedDepartment = await department.save();
    console.log('Department saved with ID:', savedDepartment._id);
    
    res.status(201).json(savedDepartment);
  } catch (error) {
    console.error('Error saving department:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Department with this name or code already exists' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

router.delete('/departments/:id', async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ message: 'Department deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const studentCount = await Student.countDocuments();
    const courseCount = await Course.countDocuments();
    const facultyCount = await Faculty.countDocuments();
    const departmentCount = await Department.countDocuments();
    
    res.json({
      students: studentCount,
      courses: courseCount,
      faculty: facultyCount,
      departments: departmentCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;