
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePhotos } from './PhotoContext';
import "../css/Gallery.css";


export default function Gallery(){
  const { photos, deletePhoto } = usePhotos();
  const navigate = useNavigate();

  return (
    <div className="container">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <h2>Gallery</h2>
        <Link to="/upload" className="btn btn-primary">Upload New</Link>
      </div>

      {photos.length === 0 ? (
        <div className="card" style={{textAlign:'center'}}>No photos yet — upload one.</div>
      ) : (
        <div className="grid grid-3">
          {photos.map(ph => (
            <div key={ph.id} className="card" style={{position:'relative',cursor:'pointer'}} onClick={() => navigate(`/photo/${ph.id}`)}>
              <button onClick={(e)=>{ e.stopPropagation(); if(window.confirm('Delete this photo?')) deletePhoto(ph.id); }}
                style={{position:'absolute',right:10,top:10,zIndex:20,background:'transparent',border:0,color:'#c62828',cursor:'pointer'}}
                title="Delete photo"
              >
                ✕
              </button>
              <div className="thumb">
                <img src={ph.dataUrl} alt={ph.title}/>
              </div>
              <div style={{marginTop:8}}>
                <strong style={{display:'block',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{ph.title}</strong>
                <div className="small-muted" style={{marginTop:6}}>{ph.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
