
import React, { useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [role,setRole] = useState('user');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try{
      const res = await API.post('/auth/register',{ name, email, password, role });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      nav('/');
    }catch(err){
      alert(err.response?.data?.message || 'Register failed');
    }
  };

  return (
    <div style={{display:'flex', justifyContent:'center'}}>
      <form className="form" onSubmit={submit}>
        <h2>Create account</h2>
        <div><input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} /></div>
        <div><input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div><input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <div style={{marginTop:6}}>
          <label style={{marginRight:8}}>
            <input type="radio" name="role" value="user" checked={role==='user'} onChange={() => setRole('user')} /> User
          </label>
          <label>
            <input type="radio" name="role" value="provider" checked={role==='provider'} onChange={() => setRole('provider')} /> Provider
          </label>
        </div>
        <div style={{marginTop:10}}>
          <button type="submit" className="btn btn-primary">Register</button>
        </div>
      </form>
    </div>
  );
}
