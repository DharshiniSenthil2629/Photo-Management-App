import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePhotos } from './PhotoContext';
import "../css/UploadPage.css";

export default function UploadPhoto(){
  const { addPhoto } = usePhotos();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  import React, { useState } from 'react';
  import { useNavigate, Link } from 'react-router-dom';
  import { usePhotos } from './PhotoContext';
  import "../css/UploadPage.css";

  export default function UploadPhoto() {
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

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!file) return alert('Select a photo');
      if (!title.trim()) return alert('Add a title');

      setUploading(true);
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        const newPhoto = {
          id: Date.now(),
          title: title.trim(),
          description: description.trim(),
          dataUrl,
          createdAt: new Date().toISOString()
        };
        addPhoto(newPhoto);
        setUploading(false);
        setTitle(''); setDescription(''); setFile(null);
        navigate('/gallery');
      };
      reader.readAsDataURL(file);
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
              <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
            </div>
            <div>
              <label className="small-muted">Description</label><br />
              <textarea className="input" rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description" />
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button className="btn btn-primary" type="submit" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
              <Link to="/gallery" className="link">Go to gallery</Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
            const navigate = useNavigate();

            // AI image generation state
            const [showAIModal, setShowAIModal] = useState(false);
            const [aiPrompt, setAIPrompt] = useState('');
            const [aiLoading, setAILoading] = useState(false);
            const [aiDataUrl, setAIDataUrl] = useState(null);
            const [aiTitle, setAITitle] = useState('');
            const [aiDescription, setAIDescription] = useState('');

            const onFile = (e) => {
              const f = e.target.files && e.target.files[0];
              setFile(f || null);
            };

            const handleSubmit = (e) => {
              e.preventDefault();
              if(!file) return alert('Select a photo');
              if(!title.trim()) return alert('Add a title');

              setUploading(true);
              const reader = new FileReader();
              reader.onload = () => {
                const dataUrl = reader.result;
                const newPhoto = {
                  id: Date.now(),
                  title: title.trim(),
                  description: description.trim(),
                  dataUrl,
                  createdAt: new Date().toISOString()
                };
                setTimeout(() => {
                  addPhoto(newPhoto);
                  setUploading(false);
                  setTitle(''); setDescription(''); setFile(null);
                  navigate('/gallery');
                }, 500);
              };
              reader.readAsDataURL(file);
            };

            function blobToDataUrl(blob){
              return new Promise((res, rej) => {
                const reader = new FileReader();
                reader.onload = () => res(reader.result);
                reader.onerror = rej;
                reader.readAsDataURL(blob);
              });
            }

            async function generateAIImage(){
              if(!aiPrompt.trim()) return alert('Enter a prompt');
              setAILoading(true);
              setAIDataUrl(null);

              // Try server-side Hugging Face proxy first
              try{
                const resp = await fetch('/api/generate-hf', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ prompt: aiPrompt.trim() })
                });
                if(resp.ok){
                  const body = await resp.json();
                  if(body && body.dataUrl){
                    setAIDataUrl(body.dataUrl);
                    setAILoading(false);
                    return;
                  }
                } else {
                  const text = await resp.text();
                  console.warn('HF proxy returned', resp.status, text);
                }
              }catch(e){
                console.warn('HF proxy unavailable or failed, falling back to client providers', e);
              }

              // Fallback: try OpenAI if key exists, otherwise use picsum placeholder
              const key = import.meta.env.VITE_OPENAI_API_KEY;
              try{
                if(key){
                  const resp = await fetch('https://api.openai.com/v1/images/generations', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${key}`
                    },
                    body: JSON.stringify({ model: 'gpt-image-1', prompt: aiPrompt.trim(), n: 1, size: '1024x1024' })
                  });
                  if(!resp.ok){
                    let text;
                    try{ text = await resp.text(); }catch(e){ text = resp.statusText || String(resp.status); }
                    console.error('OpenAI image API error', resp.status, text);
                    try{
                      const json = JSON.parse(text);
                      const err = json.error || json;
                      if(err && (err.code === 'billing_hard_limit_reached' || err.type === 'billing_limit_user_error')){
                        alert('OpenAI billing limit reached. Using a placeholder image instead. Update billing or use a different provider.');
                        const imgResp = await fetch('https://picsum.photos/1024');
                        const blob = await imgResp.blob();
                        const dataUrl = await blobToDataUrl(blob);
                        setAIDataUrl(dataUrl);
                        setAILoading(false);
                        return;
                      }
                    }catch(e){ /* ignore parse errors */ }
                    throw new Error('Image API request failed: ' + (text || resp.status));
                  }
                  const body = await resp.json();
                  const item = (body.data && body.data[0]) || null;
                  if(!item) throw new Error('No image data returned');
                  if(item.b64_json){
                    setAIDataUrl('data:image/png;base64,' + item.b64_json);
                  } else if(item.url){
                    const imgResp = await fetch(item.url);
                    const blob = await imgResp.blob();
                    const dataUrl = await blobToDataUrl(blob);
                    setAIDataUrl(dataUrl);
                  } else {
                    throw new Error('Unhandled image response format');
                  }
                } else {
                  const imgResp = await fetch('https://picsum.photos/1024');
                  const blob = await imgResp.blob();
                  const dataUrl = await blobToDataUrl(blob);
                  setAIDataUrl(dataUrl);
                }
              }catch(err){
                console.error(err);
                alert('Failed to generate image: ' + (err.message || err));
              }finally{
                setAILoading(false);
              }
            }

            function saveAIToGallery(){
              if(!aiDataUrl) return alert('No image to save');
              const titleToUse = aiTitle.trim() || ('AI Image — ' + (aiPrompt.slice(0,50) || 'Untitled'));
              const newPhoto = {
                id: Date.now(),
                title: titleToUse,
                description: aiDescription.trim(),
                dataUrl: aiDataUrl,
                createdAt: new Date().toISOString()
              };
              import React, { useState } from 'react';
              import { useNavigate, Link } from 'react-router-dom';
              import { usePhotos } from './PhotoContext';
              import "../css/UploadPage.css";

              export default function UploadPhoto() {
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

                const handleSubmit = (e) => {
                  e.preventDefault();
                  if (!file) return alert('Select a photo');
                  if (!title.trim()) return alert('Add a title');

                  setUploading(true);
                  const reader = new FileReader();
                  reader.onload = () => {
                    const dataUrl = reader.result;
                    const newPhoto = {
                      id: Date.now(),
                      title: title.trim(),
                      description: description.trim(),
                      dataUrl,
                      createdAt: new Date().toISOString()
                    };
                    addPhoto(newPhoto);
                    setUploading(false);
                    setTitle(''); setDescription(''); setFile(null);
                    navigate('/gallery');
                  };
                  reader.readAsDataURL(file);
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
                          <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
                        </div>
                        <div>
                          <label className="small-muted">Description</label><br />
                          <textarea className="input" rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description" />
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <button className="btn btn-primary" type="submit" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
                          <Link to="/gallery" className="link">Go to gallery</Link>
                        </div>
                      </form>
                    </div>
                  </div>
                );
              }
                )}
