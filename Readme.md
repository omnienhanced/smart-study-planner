# Smart Study Planner for Students

A comprehensive AI-powered study planning and note management application built with modern web technologies.

## Features

- **AI Study Timetable Generator** - Leverages Google's Gemini API to create optimized study schedules based on subjects, exam dates, and difficulty levels
- **Notes Summarizer** - Automatically summarize study notes into concise bullet points with key terms extraction
- **Quiz Generator** - Generate practice quiz questions directly from your notes
- **Daily Progress Tracker** - Track completed study tasks with visual progress indicators
- **Study Streaks** - Maintain motivation with a daily study streak counter
- **Modern UI** - Beautiful glassmorphism design with smooth animations and gradients
- **Real-time Authentication** - Secure email/password authentication with Firebase

## Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS for styling
- Firebase Authentication & Firestore
- Axios for API requests
- React Router for navigation

### Backend
- Node.js with Express.js
- Firebase Admin SDK
- Google Generative AI (Gemini)
- CORS enabled for frontend communication

### Database
- Firebase Firestore for real-time data storage
- Secure row-level security rules

## Quick Start

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup instructions.

### Quick Commands

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

## API Documentation

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for complete API endpoints and Firestore schema.

## File Structure

```
smart-study-planner/
├── backend/
│   ├── src/
│   │   ├── config/firebaseAdmin.js
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── vite.config.js
└── README.md
```

## Security

- Firebase Security Rules prevent unauthorized data access
- Environment variables keep sensitive data secure
- Gemini API calls are server-side only
- Input validation on both frontend and backend

## Performance

- Lazy loading of routes
- Optimized Firestore queries
- Efficient state management with React hooks
- Production-ready error handling

## Future Enhancements

- [ ] Study group collaboration features
- [ ] AI-powered study recommendations
- [ ] Integration with calendar apps
- [ ] Mobile app version
- [ ] Advanced analytics dashboard
- [ ] Spaced repetition system

## License

MIT

## Support

For setup help, refer to [SETUP_GUIDE.md](./SETUP_GUIDE.md) and check the Troubleshooting section.
