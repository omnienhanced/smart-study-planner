# Firestore Database Schema

## Collections Structure

### 1. Users Collection
```
users/{userId}
├── email (string) - User email
├── createdAt (timestamp) - Account creation date
└── streakCount (number) - Current study streak
```

### 2. Timetables Subcollection
```
users/{userId}/timetables/{timetableId}
├── timetable (object) - Generated timetable data
│   ├── schedule (array) - Daily schedule
│   │   ├── day (string)
│   │   └── schedule (array) - Sessions
│   │       ├── subject (string)
│   │       ├── time (string)
│   │       └── priority (string) - 'high', 'medium', 'low'
├── subjects (array) - List of subjects
├── difficulty (string) - 'easy', 'medium', 'hard'
├── dailyHours (number) - Daily study hours
└── createdAt (timestamp)
```

### 3. Notes Subcollection
```
users/{userId}/notes/{noteId}
├── title (string) - Note title
├── originalNotes (string) - Raw notes content
├── summary (object) - Summarized content
│   ├── summary (array) - Summary points
│   └── keyTerms (array) - Key terms
├── quiz (object) - Generated quiz
│   └── questions (array) - Quiz questions
│       ├── question (string)
│       ├── options (array)
│       └── answer (string)
└── createdAt (timestamp)
```

### 4. Progress Subcollection
```
users/{userId}/progress/{date}
├── date (string) - Date in YYYY-MM-DD format
├── tasks (object) - Tasks completed
│   └── {taskId}
│       ├── completed (boolean)
│       ├── subject (string)
│       └── timestamp (timestamp)
```

## Indexing Recommendations

1. Collection: users/progress
   - Fields: date (Descending)
   - Status: Required for streak calculation

2. Collection: users/notes
   - Fields: createdAt (Descending)
   - Status: Required for listing notes

3. Collection: users/timetables
   - Fields: createdAt (Descending)
   - Status: Required for listing timetables
