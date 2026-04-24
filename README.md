# Leema Furniture Admin Dashboard

A modern, full-stack furniture management system built with React, TypeScript, and FastAPI.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Authentication Flow](#authentication-flow)
- [Development Guide](#development-guide)
- [Troubleshooting](#troubleshooting)
- [Production Build](#production-build)
- [Contributing](#contributing)

## ✨ Features

### Admin Dashboard
- 📊 **Dashboard**: Real-time statistics, revenue tracking, and sales analytics
- 📦 **Products Management**: Create, read, update, delete furniture products with images and pricing
- 👥 **Users Management**: Manage admin and customer accounts with roles
- 🛠️ **Services**: Manage service offerings and descriptions
- 📈 **Analytics**: View sales trends, customer insights, and category breakdown
- 👤 **Profile**: User profile management and settings
- 📋 **Recent Orders**: Track and manage customer orders in real-time

### Authentication & Security
- 🔐 JWT-based authentication
- User login/signup with email verification
- Role-based access control (Admin/User)
- Persistent sessions with localStorage
- Protected routes and API endpoints

### User Experience
- 🎨 Beautiful Tailwind CSS UI with gradient backgrounds
- 📱 Fully responsive design (mobile, tablet, desktop)
- ⚡ Fast page loads with code splitting and lazy loading
- 🔄 Real-time data updates with modals
- 🎯 Intuitive navigation with collapsible sidebar
- 🌙 Dark theme for admin panel
- ✨ Smooth animations and transitions

### Public Pages
- 🏠 Landing/Home page with brand showcase
- ℹ️ About Us page with company story
- 🛋️ Products catalog page
- 📞 Contact Us page with contact form
- 🔗 Navigation between all public pages

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Router v6** - Client-side routing with nested routes
- **Lucide React** - Beautiful SVG icons
- **Ky** - Modern HTTP client with interceptors
- **Vite** - Fast build tool

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **JWT (PyJWT)** - Token-based authentication
- **Firebase Admin SDK** - Cloud services (optional)
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation

### Tools & Setup
- **Bun** - Fast JavaScript runtime and package manager
- **Python 3.9+** - Backend runtime
- **Node.js/npm** - Alternative package manager
- **Virtual Environment** - Python dependency isolation
- **Git** - Version control

## 📁 Project Structure
Leema_Website/ 
    ├── apps/ 
            └── frontend/
            └── backend/
            └── chatbot/
            └── database