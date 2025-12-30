# Smart Study Planner - Complete Setup Guide

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Firebase Account
- Google Cloud Project (for Gemini API)

## Backend Setup

### 1. Clone and Install Dependencies

```bash
cd backend
npm install
```

### 2. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing
3. Go to Service Accounts (Project Settings > Service Accounts)
4. Click "Generate New Private Key"
5. Download the JSON file

### 3. Environment Variables

Create `.env` file in backend directory:

```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="your_private_key_with_newlines_escaped"
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CERT_URL=your_cert_url

GEMINI_API_KEY=your_gemini_api_key
PORT=5000
NODE_ENV=development
```

### 4. Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create new API key
3. Add it to your `.env` file

### 5. Run Backend

```bash
npm start
# or for development with hot reload
npm run dev
```

Server will run on `http://localhost:5000`

---

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
npm install
```

### 2. Firebase Configuration

1. Go to Firebase Console
2. Select your project
3. Go to Settings > General
4. Copy Firebase config object

### 3. Environment Variables

Create `.env` file in frontend directory:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_BACKEND_BASE_URL=http://localhost:5000
```

### 4. Run Frontend

```bash
npm run dev
```

Application will open at `http://localhost:3000`

---

## Firebase Security Rules

1. Go to Firebase Console
2. Select your project
3. Navigate to Firestore Database > Rules
4. Replace with content from `firestore-rules.txt`
5. Click Publish

---

## Firestore Setup

1. Go to Firebase Console
2. Navigate to Firestore Database
3. Click "Create Database"
4. Choose "Production mode"
5. Select region (us-central1 recommended)

Collections will be auto-created when data is written.

Recommended indexes (Firebase will suggest):
- users/progress: date (Descending)
- users/notes: createdAt (Descending)
- users/timetables: createdAt (Descending)

---

## API Endpoints

### Timetable
- POST `/api/timetable/generate` - Generate timetable
- GET `/api/timetable/:userId` - Fetch timetable
- PUT `/api/timetable/:userId` - Update timetable
- DELETE `/api/timetable/:userId` - Delete timetable

### Notes
- POST `/api/notes/summarize` - Summarize notes
- POST `/api/notes/quiz` - Generate quiz
- GET `/api/notes/:userId` - Get user notes
- POST `/api/notes/:userId` - Save notes
- DELETE `/api/notes/:userId/:noteId` - Delete note

### Progress
- POST `/api/progress/:userId` - Log progress
- GET `/api/progress/:userId` - Get progress
- GET `/api/progress/:userId/streak` - Get streak count

---

## Deployment

### Backend (Firebase Functions / Google Cloud Run)

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init functions`
4. Deploy: `firebase deploy --only functions`

### Frontend (Vercel / Netlify)

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm run build
# Deploy 'dist' folder to Netlify
```

---

## Troubleshooting

### Backend not connecting to Frontend
- Ensure `VITE_BACKEND_BASE_URL` points to correct backend URL
- Check CORS settings in backend

### Firebase errors
- Verify .env variables are correctly set
- Check Firebase project ID and credentials
- Ensure Firestore Database is created

### Gemini API errors
- Verify API key is active
- Check rate limits on Google Cloud

---

## Features Overview

1. **Authentication** - Email/password signup and login
2. **AI Timetable Generator** - Smart study schedule using Gemini
3. **Notes Summarizer** - AI-powered note summarization
4. **Quiz Generator** - Auto-generated quizzes from notes
5. **Progress Tracker** - Daily study tracking with streaks
6. **Modern UI** - Glassmorphism, gradients, animations

---

## Sample Gemini Prompts

### Timetable Generation
```
Create an optimized study timetable with these requirements:
Subjects: [Math, Physics, Chemistry]
Exam Dates: [2024-02-15, 2024-02-20]
Difficulty Level: hard
Daily Study Hours: 6

Return JSON: { "schedule": [{ "day": "Monday", "schedule": [{ "subject": "Math", "time": "09:00-11:00", "priority": "high" }] }] }
```

### Note Summarization
```
Summarize these notes into 5-7 bullet points:
[notes content]

Return JSON: { "summary": [...], "keyTerms": [...] }
```

### Quiz Generation
```
Generate 5 quiz questions from these notes:
[notes content]

Return JSON: { "questions": [{ "question": "...", "options": ["a", "b", "c", "d"], "answer": "a" }] }
```

---

## Project Structure

```
smart-study-planner/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── index.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── index.css
│   ├── vite.config.js
│   ├── package.json
│   └── .env
└── README.md
```

---
