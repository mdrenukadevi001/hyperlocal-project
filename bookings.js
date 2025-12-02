
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const { protect, authorizeRoles } = require('../middleware/auth');

// create booking (user)
router.post('/', protect, authorizeRoles('user'), async (req,res)=>{
  try{
    const { serviceId, scheduledAt, notes } = req.body;
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const booking = await Booking.create({
      user: req.user._id,
      provider: service.provider,
      service: service._id,
      scheduledAt: new Date(scheduledAt),
      amount: service.price,
      notes
    });

    // TODO: notify provider via push/email

    res.json(booking);
  }catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// provider: list bookings for provider
router.get('/provider', protect, authorizeRoles('provider'), async (req,res)=>{
  try{
    const bookings = await Booking.find({ provider: req.user._id }).populate('service user');
    res.json(bookings);
  }catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// user: list user bookings
router.get('/user', protect, authorizeRoles('user'), async (req,res)=>{
  try{
    const bookings = await Booking.find({ user: req.user._id }).populate('service provider');
    res.json(bookings);
  }catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// provider accept/reject booking
router.post('/:id/status', protect, authorizeRoles('provider'), async (req,res)=>{
  try{
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });
    if (booking.provider.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
    const { status } = req.body;
    if (!['accepted','rejected','completed','cancelled'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    booking.status = status;
    await booking.save();
    res.json(booking);
  }catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});



module.exports = router;
