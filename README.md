# WorldWise - Travel Tracking App

A React application that helps you track and memorialize your travels around the world. Built with React, TypeScript, and Leaflet maps.

## Features

- 🗺️ Interactive World Map using Leaflet
- 📍 Mark and track visited places
- ✏️ Add notes and details about each location
- 🗑️ Remove visited places
- 🔐 JWT based User authentication system
- 📍 Geolocation support to find your current position

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router v6
- Leaflet Maps
- CSS Modules
- Context API for state management
- Node.js Backend + GraphQL API
- Primsa ORM + MySQL DB

## Getting Started

1. Clone the repository
```bash
git clone <repository-url>
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

## Usage

1. Log in using the demo credentials
2. Navigate the world map
3. Click any city on the map to add a new location
4. Fill in details about your visit
5. View your visited places in the sidebar
6. Use the "Use Your Position" button to center the map on your current location

## Project Structure

```
backend/
    ├── prisma/        # Prisma Schema definations
  src/
    ├── apollo/        # Apollo server and GraphQL API setup
frontend/
  src/
    ├── components/    # React components
    ├── context/       # Context providers
    ├── hooks/         # Custom hooks
    ├── pages/         # Route components
    ├── styles/        # CSS modules
types/                 # TypeScript types

```


Note:
Currently this website works good on medium & larger screen sized devices only as I have not made it responsive yet 😝...
