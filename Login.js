
import React, { useState } from 'react';
import API from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try{
      const res = await API.post('/auth/login',{ email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      nav('/');
    }catch(err){
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{display:'flex', justifyContent:'center'}}>
      <form className="form" onSubmit={submit}>
        <h2>Login</h2>
        <div>
          <input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div style={{display:'flex', gap:8, marginTop:6}}>
          <button type="submit" className="btn btn-primary">Login</button>
          <Link to="/register" className="btn btn-ghost">Register</Link>
        </div>
      </form>
    </div>
  )
}
