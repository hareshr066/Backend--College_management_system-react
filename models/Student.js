import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  course: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  rollNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  phone: String,
  address: String
}, {
  timestamps: true
});

studentSchema.pre('save', async function(next) {
  if (!this.rollNumber) {
    this.rollNumber = 'STU' + Date.now() + Math.floor(Math.random() * 1000);
  }
  next();
});

export default mongoose.model('Student', studentSchema);