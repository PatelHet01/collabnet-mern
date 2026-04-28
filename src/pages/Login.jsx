import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('brand@collabnet.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Connect to our express backend
      const res = await axios.post('http://localhost:5005/api/auth/login', { email, password });
      if (res.data.success) {
        login(res.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid credentials. Try: admin@, brand@, creator@, agency@ (pw: password123)');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 style={{textAlign: 'center'}}>CollabNet.</h2>
        <p style={{textAlign: 'center', color: 'var(--text-muted)'}}>Sign in to your account</p>
        
        {error && <div style={{color: 'red', marginBottom: '1rem', fontSize: '0.9rem'}}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Log In</button>
        </form>
        
        <div style={{marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '1rem'}}>
          <strong>Demo Credentials:</strong><br/>
          Admin: admin@collabnet.com<br/>
          Brand: brand@collabnet.com<br/>
          Creator: creator@collabnet.com<br/>
          Agency: agency@collabnet.com<br/>
          Password for all: password123
        </div>
      </div>
    </div>
  );
}
