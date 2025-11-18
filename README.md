# 📸 Photo Management App

A simple and clean Photo Management Web Application where users can upload photos to **Cloudinary**, view them in a gallery, edit details like **title, description, and image**, or delete them.  

No AI image creation feature is included — only upload, edit, and delete functionalities.

---

## 🚀 Features

### ✅ Photo Upload
- Upload photos directly from your device.
- All photos are stored securely in **Cloudinary**.
- Shows preview before submitting.

### ✏️ Edit Photo Details
You can update:
- Photo title
- Description
- Replace the image with a new one (update on Cloudinary)

### 🗑️ Delete Photos
- Delete any photo from the gallery.
- Photo gets removed from Cloudinary.

### 🖼️ Gallery View
- Grid-based gallery UI.
- Clicking a photo opens detailed view with edit/delete options.

---

## 🛠️ Tech Stack

### **Frontend**
- React + Vite  
- Context API  
- CSS Modules  

### **Backend**
- Node.js  
- Express  

### **Cloud Storage**
- Cloudinary

---

### 📂 Project Structurephoto-app/
│
├── src/
│   ├── components/
│   │   ├── Gallery.jsx
│   │   ├── PhotoDetails.jsx
│   │   ├── UploadPhoto.jsx
│   │   ├── UploadOnly.jsx
│   │
│   ├── context/
│   │   ├── PhotoContext.jsx
│   │
│   ├── utils/
│   │   ├── uploadToCloudinary.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│
├── server/
│   ├── index.js
│
├── public/
│
├── .gitignore
├── package.json
├── README.md
├── vite.config.js



---

## 🔧 Setup Instructions

### 1. Clone the Repo


git clone <your-repo-url>
cd photo-app


### 2. Install Dependencies


npm install


### 3. Create `.env` File (Do NOT Commit)


VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name


### 4. Start Frontend


npm run dev


### 5. Start Backend


node server/index.js


---

- Upload  
- Edit details  
- Delete  
- View gallery  

---

## 🎯 Future Enhancements (Optional)
- Search photos by title  
- User authentication  
- Tag-based filtering  
- Album creation  
-Create an AI image 

---

## ❤️ Author
Developed by **Dharshini Senthil**  
Photo Management App – Internship Project (Assignment)
