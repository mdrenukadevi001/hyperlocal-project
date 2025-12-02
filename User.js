
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user','provider','admin'], default: 'user' },
  phone: { type: String },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0,0] } // [lng, lat]
  },
  createdAt: { type: Date, default: Date.now },
  profile: {
    about: String,
    skills: [String],
    experienceYears: Number,
    avatarUrl: String
  }
});

UserSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', UserSchema);
