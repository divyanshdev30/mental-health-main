<p align="center">
  <img src="./src/images/Readme-Banner.png" alt="MindSpace Banner" width="720" />
</p>

# 🌿 MindSpace — Mental Health Support App

Your space to breathe, reflect, and grow. A supportive web application with resources, screenings, a mood tracker, bookings, forum, and a friendly chatbot.

---

## ✨ Features

- 🔐 Auth with Firebase (Email/Password + Google)
- 😊 Daily Mood tracking (stored in Firestore per user)
- 📋 Mental health screenings
- 📅 Bookings (stub UI, ready to connect)
- 📚 Resource hub
- 💬 Community forum (local demo, ready to connect)
- 🎨 ShadCN + Tailwind UI, Dark/Light themes

## 🛠️ Tech Stack

- React + TypeScript + Vite
- TailwindCSS + ShadCN UI + Radix + Framer Motion
- Firebase (Auth + Firestore)

---

## 🚀 Getting Started

1. Install dependencies

- pnpm i (or npm i / yarn)

2. Run the app

- pnpm dev (or npm run dev / yarn dev)

3. Open http://localhost:8080

### Firebase setup

- Create a Firebase project, enable Authentication and Firestore
- Copy your Firebase web config into src/components/firebase.js
- Recommended Firestore rules to protect mood data:

rules_version = '2';
service cloud.firestore {
match /databases/{database}/documents {
match /users/{userId}/moods/{doc} {
allow read, write: if request.auth != null && request.auth.uid == userId;
}
}
}

---

## 📁 Project Structure (src is the primary app)

- src/
  - components/ (UI + feature components)
  - context/ (AuthProvider, app context)
  - pages/ (Dashboard, Chatbot, Booking, etc.)
  - layouts/ (Main layout and wrappers)
  - hooks/, lib/, data/
- server/ (Express server for dev proxy)
- shared/ (shared types and utilities)

Note: A legacy client/ folder exists but is no longer used. The app now boots from src/.

---

## 🔧 Environment

- VITE_OPENAI_API_KEY (optional, reserved for future AI features)

## 🚢 Deployment

- Netlify or Vercel recommended. Build command: pnpm build. Output: dist/spa

## ❤️ Contributing

Issues and PRs welcome. Be kind and inclusive.

## 📜 License

MIT
