import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePhotos } from './PhotoContext';
import "../css/UploadPage.css";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

export default function UploadOnly() {
  const { addPhoto } = usePhotos();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    setFile(f || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert("Select a photo");
    if (!title.trim()) return alert("Add a title");

    setUploading(true);

    // 🚀 Upload to Cloudinary
    const cloudUrl = await uploadToCloudinary(file);

    const newPhoto = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      dataUrl: cloudUrl,     // saved cloud URL
      createdAt: new Date().toISOString()
    };

    addPhoto(newPhoto);
    setUploading(false);
    setTitle('');
    setDescription('');
    setFile(null);

    navigate('/gallery');
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Upload Photo</h2>

        <form onSubmit={handleSubmit} style={{ marginTop: 12, display: 'grid', gap: 12 }}>

          <div>
            <label className="small-muted">Photo</label><br />
            <input type="file" accept="image/*" onChange={onFile} />
          </div>

          <div>
            <label className="small-muted">Title</label><br />
            <input
              className="input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title"
            />
          </div>

          <div>
            <label className="small-muted">Description</label><br />
            <textarea
              className="input"
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Short description"
            />
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn btn-primary" type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </button>

            <Link to="/gallery" className="link">Go to gallery</Link>
          </div>

        </form>
      </div>
    </div>
  );
}
