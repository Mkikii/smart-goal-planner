# 🎯 Smart Goal Planner

A beginner-friendly React app for managing savings goals, tracking deposits, and viewing progress. Simulates full CRUD with `json-server`.

## ✨ Features

- Add/edit/delete savings goals
- Deposit into active goals
- Visual progress bars per goal
- Dashboard with:
  - Total saved 💰
  - Goals completed ✅
  - Deadline warnings ⏳
- Local data via `db.json`
- Responsive design

## 🚀 Tech Stack

- React + Hooks
- Pure CSS
- json-server
- npm

## 🛠️ Installation

### Prerequisites
- Node.js
- Git
- json-server (`npm install -g json-server`)

### Steps

```bash
# Start backend
json-server --watch db.json -p 3001

# Start frontend
cd smart-goal-planner
npm install
npm start
