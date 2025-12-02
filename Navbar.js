import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar(){
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || null;

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    nav('/');
  };

  return (
    <header className="site-nav">
      <div className="nav-inner">
        <div className="brand">
          <Link to="/">Hyperlocal</Link>
        </div>
        <nav className="links">
          <Link to="/services">Services</Link>
          <Link to="/dashboard">Dashboard</Link>
          {user ? (
            <>
              <span className="user">{user.name}</span>
              <button className="btn btn-ghost" onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
