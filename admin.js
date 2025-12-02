
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Service = require('../models/Service');
const { protect, authorizeRoles } = require('../middleware/auth');

// admin-only endpoints
router.get('/stats', protect, authorizeRoles('admin'), async (req,res)=>{
  try{
    const users = await User.countDocuments();
    const providers = await User.countDocuments({ role: 'provider' });
    const services = await Service.countDocuments();
    res.json({ users, providers, services });
  }catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});



module.exports = router;
