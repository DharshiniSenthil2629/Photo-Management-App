import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { PhotoProvider } from './components/PhotoContext';
// Use a clean upload-only component (avoids corrupted UploadPhoto.jsx)
import UploadPhoto from './components/UploadOnly';
import Gallery from './components/Gallery';
import PhotoDetails from './components/PhotoDetails';
import './App.css';

export default function App(){

  return (
    <PhotoProvider>
      <Router>
        <header 
          style={{
            background: "#0b0b0c",
            padding: "12px 0",
            boxShadow: "0 6px 20px rgba(0,0,0,0.45)"
          }}
        >
          <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <Link to="/gallery" style={{fontWeight:700}}>Photo Management App</Link>
            <nav>
              <Link to="/gallery" style={{marginRight:12}} className="link">Gallery</Link>
              <Link to="/upload" style={{marginRight:12}} className="link">Upload</Link>
            </nav>
          </div>
        </header>

        <main style={{paddingTop:20}}>
          <Routes>
            <Route path="/" element={<Gallery/>} />
            <Route path="/gallery" element={<Gallery/>} />
            <Route path="/upload" element={<UploadPhoto/>} />
            <Route path="/photo/:id" element={<PhotoDetails/>} />
            <Route path="*" element={<div className="container"><div className="card">Page not found — <Link to="/gallery">go home</Link></div></div>} />
          </Routes>
        </main>

        {/* AI modal removed */}
      </Router>
    </PhotoProvider>
  );
}
