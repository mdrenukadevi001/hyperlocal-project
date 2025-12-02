
const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect, authorizeRoles } = require('../middleware/auth');

// create service (provider)
router.post('/', protect, authorizeRoles('provider'), async (req,res)=>{
  try{
    const data = { ...req.body, provider: req.user._id };
    const service = await Service.create(data);
    res.json(service);
  }catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// update service
router.put('/:id', protect, authorizeRoles('provider'), async (req,res)=>{
  try{
    let service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Not found' });
    if (service.provider.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
    Object.assign(service, req.body);
    await service.save();
    res.json(service);
  }catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// list services + optional geo search & category
router.get('/', async (req,res)=>{
  try{
    const { q, category, lat, lng, radiusKm = 10, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (q) filter.title = new RegExp(q, 'i');
    if (category) filter.category = category;
    // geo filtering
    if (lat && lng) {
      filter.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radiusKm) * 1000
        }
      };
    }
    const services = await Service.find(filter).populate('provider','name profile').skip((page-1)*limit).limit(parseInt(limit));
    res.json(services);
  }catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// service detail
router.get('/:id', async (req,res)=>{
  try{
    const service = await Service.findById(req.params.id).populate('provider','name profile');
    if (!service) return res.status(404).json({ message: 'Not found' });
    res.json(service);
  }catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
