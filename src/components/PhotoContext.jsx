import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'photo_app_photos_v1';
const PhotoContext = createContext();

export function usePhotos() {
  return useContext(PhotoContext);
}

export function PhotoProvider({ children }) {
  const [photos, setPhotos] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  }, [photos]);

  function addPhoto(photo) {
    setPhotos(p => [photo, ...p]);
  }
  function getPhoto(id) {
    return photos.find(ph => String(ph.id) === String(id));
  }

  function deletePhoto(id) {
    setPhotos(p => p.filter(ph => String(ph.id) !== String(id)));
  }

  function updatePhoto(id, updates) {
    setPhotos(p => p.map(ph => (String(ph.id) === String(id) ? { ...ph, ...updates } : ph)));
  }

  return (
    <PhotoContext.Provider value={{ photos, addPhoto, getPhoto, deletePhoto, updatePhoto }}>
      {children}
    </PhotoContext.Provider>
  );
}
