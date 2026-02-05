# Smart Study Planner – System Design Document

## 1. Architecture Overview

Frontend (React)
        |
Backend API (Node.js / FastAPI)
        |
Database (Firebase / MongoDB)

## 2. Frontend Components
- Dashboard
- Study Planner
- Task Manager
- Progress Charts
- Settings

## 3. Backend Services
- Authentication Service
- Task Service
- Schedule Generator
- Analytics Engine

## 4. Database Structure

### Users
- id
- name
- email
- preferences

### Tasks
- id
- user_id
- subject
- duration
- status
- deadline

### StudyPlans
- id
- user_id
- date
- tasks[]

### Progress
- user_id
- completed_tasks
- streaks

## 5. Data Flow
User → Frontend → API → Database → API → Frontend

## 6. Security
- JWT Authentication
- Encrypted passwords
- Role-based access

## 7. Scalability
- Modular services
- Cloud hosting
- Load balancing ready

---

