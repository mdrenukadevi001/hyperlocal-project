
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home(){
  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <h1>Hyperlocal Service Marketplace</h1>
          <p className="muted">Find trusted local professionals quickly — plumbing, electrical, beauty, home repairs and more.</p>
          <div className="hero-cta">
            <Link to="/services" className="btn btn-primary">Browse Services</Link>
            <Link to="/register" className="btn btn-ghost">Get Started</Link>
          </div>
        </div>
        <div className="hero-media">
          <div className="card" style={{width:320}}>
            <img alt="local services" src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=7f3f5a9c" style={{width:'100%', borderRadius:10}} />
          </div>
        </div>
      </section>
    </div>
  )
}
