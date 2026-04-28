const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Fake "DB" for fast testing with fixed credentials
const USERS = [
  { id: 1, email: 'admin@collabnet.com', password: 'password123', role: 'admin', name: 'Super Admin' },
  { id: 2, email: 'brand@collabnet.com', password: 'password123', role: 'brand', name: 'Brand Manager' },
  { id: 3, email: 'creator@collabnet.com', password: 'password123', role: 'creator', name: 'Sarah Creator' },
  { id: 4, email: 'agency@collabnet.com', password: 'password123', role: 'agency', name: 'Agency Pro' },
];

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = USERS.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, role, name } = req.body;
  const newUser = { id: USERS.length + 1, email, password, role, name };
  USERS.push(newUser);
  const { password: _, ...userWithoutPassword } = newUser;
  res.json({ success: true, user: userWithoutPassword });
});

const PORT = 5005;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
