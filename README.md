# CommunityConnect

## Overview
CommunityConnect is a comprehensive web application designed for residential communities. It provides a platform where residents can interact with each other, access community services, manage and participate in events, and handle various community-related activities in one centralized location.

## Features

### Authentication & Security
* **Role-based Access Control**
  * Security Admin - Manages security-related features and permissions
  * Admin - Oversees community management and user activities
  * User - Regular residents with standard platform access
* **JWT Authentication** - Secure login and session management

### Community Engagement
* **Social Feed** - Users can create, view, and interact with community posts
* **Interaction Tools** - Like, comment, and share functionality for posts
* **Real-time Chat System** - Direct communication between community members

### Services & Events
* **Community Services Directory** - Browse and access various services available to residents
* **Event Management** - Discover community events
* **Hall Booking System** - Reserve community spaces for private or public events

### Additional Features
* **Stripe Payment Integration** - Secure payment processing for services and bookings
* **QR Code Generator** - For event check-ins, quick access, and payment verification
* **Push Notifications** - Real-time Firebase notifications for important updates
* **Interactive Maps** - Google Maps integration for location-based features

## Tech Stack

### Frontend
* React 18
* Redux Toolkit with Redux Persist
* Material UI v6
* TypeScript
* React Router v7
* Formik & Yup for form validation
* Socket.io Client for real-time features
* React Big Calendar for event scheduling

### Backend
* Node.js with Express
* MongoDB with Mongoose
* JWT for authentication
* Socket.io for real-time communication
* Stripe API for payment processing
* Cloudinary for media storage
* Nodemailer for email communications
* QR Code generation

## Installation & Setup

### Prerequisites
* Node.js (v16 or later)
* MongoDB
* Stripe account for payment processing
* Firebase project for push notifications
* Google Maps API key

### Backend Setup
```sh
# Clone the repository
git clone https://github.com/farzanashaneez/CommunityConnect.git
cd CommunityConnect/server

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Frontend Setup
```sh
cd ../client

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

## Environment Variables

### Backend (.env)
```
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Firebase (for notifications)
FIREBASE_SERVER_KEY=your_firebase_server_key
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_FIREBASE_CONFIG=your_firebase_config_json
```

## Deployment
Instructions for deploying to production environments like Heroku, Vercel, AWS, etc.

## Usage
1. Register as a new user or login with existing credentials
2. Explore the community feed to see posts from other residents
3. Check upcoming events and book community halls as needed
4. Access community services through the services directory
5. Use the chat feature to communicate with other residents

## Contributing
Guidelines for contributing to the project.

## Contact
Developed by [Farzana] - [farzanashaneez@gmail.com.com]
