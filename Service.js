
const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  category: { type: String },
  description: { type: String },
  price: { type: Number, required: true },
  durationMinutes: { type: Number, default: 60 },
  images: [String],
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0,0] } // [lng, lat]
  },
  avgRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

ServiceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Service', ServiceSchema);
