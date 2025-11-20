import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import LoginPage from './pages/Login.jsx';

function App() {
  return (
                <BrowserRouter>

                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                    </Routes>
                </BrowserRouter>
  )
}

export default App
