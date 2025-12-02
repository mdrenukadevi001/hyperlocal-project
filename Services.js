
import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { Link } from 'react-router-dom';

export default function Services(){
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [radius, setRadius] = useState(10);

  const fetchServices = () => {
    const params = new URLSearchParams();
    if (search) params.append('q', search);
    if (category) params.append('category', category);
    if (lat && lng) {
      params.append('lat', lat);
      params.append('lng', lng);
      params.append('radiusKm', radius);
    }
    API.get(`/services?${params}`)
      .then(res=> setServices(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchServices();
  }, []);
  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
        <h2>Services</h2>
        <Link to="/services" className="small muted">Updated live</Link>
      </div>

      <div className="form" style={{marginBottom:20}}>
        <h3>Search Services</h3>
        <input type="text" placeholder="Search by title" value={search} onChange={e=>setSearch(e.target.value)} />
        <input type="text" placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} />
        <input type="number" placeholder="Latitude" value={lat} onChange={e=>setLat(e.target.value)} />
        <input type="number" placeholder="Longitude" value={lng} onChange={e=>setLng(e.target.value)} />
        <input type="number" placeholder="Radius (km)" value={radius} onChange={e=>setRadius(e.target.value)} />
        <button onClick={fetchServices} className="btn btn-primary">Search</button>
      </div>

      {services.length === 0 && <p className="muted">No services yet</p>}

      <div className="grid">
        {services.map(s => (
          <div className="card" key={s._id}>
            <h3>{s.title}</h3>
            <p className="muted small">{s.description?.slice(0, 120)}{s.description && s.description.length > 120 ? '...' : ''}</p>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12}}>
              <div className="price">₹{s.price}</div>
              <div className="small muted">by {s.provider?.name || '—'}</div>
            </div>
            <div style={{marginTop:12}}>
              <Link to={`/services/${s._id}`} className="btn btn-ghost">View</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
