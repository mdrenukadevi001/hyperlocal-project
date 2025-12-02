
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../utils/api';

export default function ServiceDetail(){
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [date, setDate] = useState('');
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(()=>{
    API.get(`/services/${id}`).then(res=> setService(res.data)).catch(err=> console.error(err));
    API.get(`/reviews/service/${id}`).then(res=> setReviews(res.data)).catch(err=> console.error(err));
  },[id]);

  const book = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login as a user to book');
    try{
      const res = await API.post('/bookings', { serviceId: id, scheduledAt: date });
      alert('Booking created: ' + res.data._id);
    }catch(err){
      console.error(err);
      alert(err.response?.data?.message || 'Booking failed');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login to review');
    try{
      await API.post('/reviews', { serviceId: id, rating: newReview.rating, comment: newReview.comment });
      alert('Review submitted!');
      setNewReview({ rating: 5, comment: '' });
      // Refresh reviews
      API.get(`/reviews/service/${id}`).then(res=> setReviews(res.data)).catch(err=> console.error(err));
    }catch(err){
      console.error(err);
      alert(err.response?.data?.message || 'Review failed');
    }
  };

  if (!service) return <p>Loading...</p>;
  return (
    <div className="grid" style={{gridTemplateColumns:'1fr 320px'}}>
      <div>
        <div className="card">
          <h2>{service.title}</h2>
          <p className="muted">by {service.provider?.name}</p>
          <p style={{marginTop:12}}>{service.description}</p>
          <div style={{marginTop:12}} className="price">₹{service.price}</div>
        </div>

        {/* Provider Profile */}
        {service.provider && (
          <div className="card" style={{marginTop:20}}>
            <h3>Provider Profile</h3>
            <p><strong>Name:</strong> {service.provider.name}</p>
            <p><strong>Email:</strong> {service.provider.email}</p>
            {service.provider.profile?.about && <p><strong>About:</strong> {service.provider.profile.about}</p>}
            {service.provider.profile?.skills && <p><strong>Skills:</strong> {service.provider.profile.skills.join(', ')}</p>}
            {service.provider.profile?.experienceYears && <p><strong>Experience:</strong> {service.provider.profile.experienceYears} years</p>}
          </div>
        )}

        {/* Reviews */}
        <div className="card" style={{marginTop:20}}>
          <h3>Reviews ({reviews.length})</h3>
          {reviews.length === 0 && <p className="muted">No reviews yet</p>}
          {reviews.map(r => (
            <div key={r._id} style={{borderBottom:'1px solid #eee', paddingBottom:10, marginBottom:10}}>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <strong>{r.user?.name}</strong>
                <span>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
              </div>
              <p className="muted small">{r.comment}</p>
            </div>
          ))}
          <form onSubmit={submitReview} style={{marginTop:20}}>
            <h4>Add Review</h4>
            <label>Rating:</label>
            <select value={newReview.rating} onChange={e=>setNewReview({...newReview, rating: e.target.value})}>
              {[1,2,3,4,5].map(n=><option key={n} value={n}>{n} stars</option>)}
            </select>
            <textarea placeholder="Comment" value={newReview.comment} onChange={e=>setNewReview({...newReview, comment: e.target.value})} required />
            <button type="submit" className="btn btn-primary">Submit Review</button>
          </form>
        </div>
      </div>

      <aside>
        <div className="form">
          <h3>Book this service</h3>
          <label>Choose date & time</label>
          <input type="datetime-local" value={date} onChange={e=>setDate(e.target.value)} />
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button className="btn btn-primary" onClick={book}>Book</button>
          </div>
        </div>

        {/* Payment Section - for demo, assume booking is unpaid initially */}
        <div className="form" style={{marginTop:20}}>
          <h3>Payment</h3>
          <p>Amount: ₹{service.price}</p>
          <button className="btn btn-primary" onClick={() => alert('Payment feature: In a real app, integrate with payment gateway.')}>Pay Now (Mock)</button>
        </div>
      </aside>
    </div>
  )
}
