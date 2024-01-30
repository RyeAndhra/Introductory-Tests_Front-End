import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/dashboard' element={<Dashboard />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/' element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  )
}