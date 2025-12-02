
import React, { useEffect, useState } from 'react';
import API from '../utils/api';

export default function Dashboard(){
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ title: '', category: '', description: '', price: '', durationMinutes: '' });

  useEffect(()=>{
    if(!user) return;
    const fetchData = async () => {
      try{
        if(user.role === 'provider'){
          const resBookings = await API.get('/bookings/provider');
          setBookings(resBookings.data);
          const resServices = await API.get('/services');
          setServices(resServices.data.filter(s => s.provider._id === user.id));
        }else if(user.role === 'user'){
          const res = await API.get('/bookings/user');
          setBookings(res.data);
        }
      }catch(err){ console.error(err); }
    };
    fetchData();
  },[user]);

  const addService = async (e) => {
    e.preventDefault();
    try {
      await API.post('/services', newService);
      alert('Service added successfully!');
      setNewService({ title: '', category: '', description: '', price: '', durationMinutes: '' });
      // Refresh services
      const resServices = await API.get('/services');
      setServices(resServices.data.filter(s => s.provider._id === user.id));
    } catch (err) {
      alert('Failed to add service: ' + (err.response?.data?.message || err.message));
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await API.post(`/bookings/${id}/status`, { status });
      alert(`Booking ${status}!`);
      // Refresh bookings
      const resBookings = await API.get('/bookings/provider');
      setBookings(resBookings.data);
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    }
  };

  if (!user) return <p>Please login.</p>;
  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>Dashboard</h2>
        <div className="muted">Logged in as {user.name} ({user.role})</div>
      </div>

      {user.role === 'provider' && (
        <>
          <h3 style={{marginTop:18}}>Your Services</h3>
          {services.length === 0 && <p className="muted">No services yet</p>}
          <div className="grid" style={{marginTop:10}}>
            {services.map(s => (
              <div className="card" key={s._id}>
                <strong>{s.title}</strong>
                <p className="muted small">{s.description}</p>
                <div className="price">₹{s.price}</div>
              </div>
            ))}
          </div>
          <h3 style={{marginTop:18}}>Add New Service</h3>
          <form className="form" onSubmit={addService}>
            <input type="text" placeholder="Title" value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} required />
            <input type="text" placeholder="Category" value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})} required />
            <textarea placeholder="Description" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} required />
            <input type="number" placeholder="Price" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} required />
            <input type="number" placeholder="Duration (minutes)" value={newService.durationMinutes} onChange={e => setNewService({...newService, durationMinutes: e.target.value})} required />
            <button type="submit" className="btn btn-primary">Add Service</button>
          </form>
        </>
      )}
      <h3 style={{marginTop:18}}>Bookings</h3>
      {bookings.length === 0 && <p className="muted">No bookings yet</p>}
      <div className="grid" style={{marginTop:10}}>
        {bookings.map(b => (
          <div className="card" key={b._id}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <strong>{b.service?.title}</strong>
              <span className="small muted">{b.status}</span>
            </div>
            <div className="muted small" style={{marginTop:8}}>{new Date(b.scheduledAt).toLocaleString()}</div>
            <div style={{marginTop:10}} className="small">Customer: {b.user?.name || b.customerName || '—'}</div>
            {user.role === 'provider' && b.status === 'pending' && (
              <div style={{marginTop:10}}>
                <button onClick={() => updateBookingStatus(b._id, 'accepted')} className="btn btn-primary">Accept</button>
                <button onClick={() => updateBookingStatus(b._id, 'rejected')} className="btn btn-ghost">Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
