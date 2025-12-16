import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  duration: {
    type: String,
    required: true
  },
  fees: {
    type: Number,
    required: true
  },
  description: String,
  department: String
}, {
  timestamps: true
});

export default mongoose.model('Course', courseSchema);