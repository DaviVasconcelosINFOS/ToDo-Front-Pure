// App.tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import SignUp from './pages/SignUp/SignUp';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;
