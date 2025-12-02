
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledAt: { type: Date, required: true },
  status: { type: String, enum: ['pending','accepted','rejected','completed','cancelled'], default: 'pending' },
  amount: { type: Number, required: true },
  paymentStatus: { type: String, enum:['unpaid','paid','refunded'], default: 'unpaid' },
  createdAt: { type: Date, default: Date.now },
  notes: String
});

module.exports = mongoose.model('Booking', BookingSchema);
