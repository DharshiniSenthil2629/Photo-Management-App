export async function uploadToCloudinary(file) {
  const cloudName = import.meta.env.VITE_CLOUD_NAME;
  const preset = import.meta.env.VITE_CLOUD_PRESET;

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", preset);

  const res = await fetch(url, {
    method: "POST",
    body: fd
  });

  const data = await res.json();
  return data.secure_url;
}
