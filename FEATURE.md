# 🌟 Windsurf Prompt for a Popover Modal Image Upload

## 🎯 Project Overview
Design a **seamless, modern image upload experience** for the **Craven Cancer Classic** website using a **popover modal UI**. The upload flow should be simple, intuitive, and visually engaging, inspired by:

- **Google Photos** – Clean layout, instant previews
- **Dropbox** – Smooth drag-and-drop upload experience with progress indicators
- **Unsplash** – Minimalist UI with elegant previews

---

## 🚀 Key Features
- **📂 Upload in a Popover Modal**  
  Clicking the upload button should open a modal overlay for a focused, distraction-free upload experience.
- **🖼️ Image Preview Before Upload**  
  Display thumbnails before users finalize their uploads.
- **📊 Upload Progress Indicator**  
  Show a smooth progress bar while images are uploading.
- **🗑️ Remove & Reorder Support**  
  Users should be able to delete or rearrange images before confirming the upload.
- **🚀 Cloudinary Integration**  
  Automatically handle file uploads, transformations, and optimizations.
- **🌐 Fully Responsive**  
  Ensure the popover modal works well on both **mobile and desktop**.
- **⚡ Vercel Deployment Optimization**  
  Keep the build lightweight and performant.

---

## 🛠️ Tech Stack Requirements
- **Frontend:** React + TailwindCSS
- **Storage & CDN:** Cloudinary (for storing and optimizing images)
- **Deployment:** Vercel
- **Modal Handling:** Headless UI (`@headlessui/react`) or Radix UI
- **File Handling:** React Dropzone or a similar lightweight drag-and-drop uploader
- **State Management:** Local state (or React Context if needed)

---

## 🖥️ UI & User Flow
1. **User clicks an "Upload Image" button → Modal opens.**
2. **User drags and drops files OR selects them manually.**
3. **Thumbnails appear inside the modal with remove/reorder options.**
4. **Upload progress bar shows as files are uploaded.**
5. **Once complete, images are stored in Cloudinary and displayed in a gallery.**
6. **User can close the modal at any time (with confirmation if an upload is in progress).**

---

## ⚠️ Admin Simplicity
- **Easy image management**: Admins can delete, update, or bulk upload images.
- **Metadata support**: Store additional details such as uploader name, date, and category.
- **Automatic image optimization**: Serve optimized images via Cloudinary’s CDN.

---

## 💡 Design Considerations
- **Modal should have a smooth open/close animation.**
- **Dark overlay background with a clean, white upload area.**
- **Progress bar should be visually distinct and easy to understand.**
- **Buttons for "Cancel" and "Upload" should be clear and accessible.**
