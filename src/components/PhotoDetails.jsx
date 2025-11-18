import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { usePhotos } from './PhotoContext';
import "../css/PhotoDetails.css";


export default function PhotoDetails(){
  const { id } = useParams();
  const { getPhoto } = usePhotos();
  const photo = getPhoto(id);
  const navigate = useNavigate();

  const { updatePhoto, deletePhoto } = usePhotos();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(photo ? photo.title : '');
  const [description, setDescription] = useState(photo ? photo.description : '');

  if(!photo){
    return (
      <div className="container">
        <div className="card" style={{textAlign:'center'}}>
          <p>Photo not found.</p>
          <button className="btn" onClick={()=>navigate('/gallery')}>Back</button>
        </div>
      </div>
    );
  }
  function startEdit(){
    setTitle(photo.title);
    setDescription(photo.description);
    setEditing(true);
  }

  function cancelEdit(){
    setEditing(false);
  }

  function saveEdit(){
    if(!title.trim()) return alert('Title cannot be empty');
    updatePhoto(photo.id, { title: title.trim(), description: description.trim() });
    setEditing(false);
  }

  function handleDelete(){
    if(window.confirm('Delete this photo?')){
      deletePhoto(photo.id);
      navigate('/gallery');
    }
  }
  return (
    <div className="container">
      <div style={{marginBottom:12}}>
        <Link to="/gallery" className="link">← Back to gallery</Link>
      </div>

      <div className="card" style={{display:'flex',gap:16,flexDirection:'column'}}>
        <img src={photo.dataUrl} alt={photo.title} style={{maxHeight:'70vh',width:'100%',objectFit:'contain',borderRadius:8}}/>
        <div>
          {editing ? (
            <div style={{display:'grid',gap:8}}>
              <input className="input" value={title} onChange={e=>setTitle(e.target.value)} />
              <textarea className="input" rows={4} value={description} onChange={e=>setDescription(e.target.value)} />
              <div style={{display:'flex',gap:8}}>
                <button className="btn btn-primary" onClick={saveEdit}>Save</button>
                <button className="btn" onClick={cancelEdit}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete} style={{marginLeft:'auto'}}>Delete</button>
              </div>
            </div>
          ) : (
            <>
              <h3>{photo.title}</h3>
              <div className="small-muted" style={{marginTop:8}}>{photo.description}</div>
              <div className="small-muted" style={{marginTop:8,fontSize:12}}>Uploaded: {new Date(photo.createdAt).toLocaleString()}</div>
              <div style={{marginTop:12,display:'flex',gap:8}}>
                <button className="btn btn-primary" onClick={startEdit}>Edit</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
