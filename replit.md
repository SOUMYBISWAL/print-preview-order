# PrintLite - Frontend-Only Document Printing Service

## Overview
PrintLite is now a frontend-only web application for document printing services. It operates entirely in the browser using localStorage for data persistence, making it perfect for deployment on static hosting platforms like AWS Amplify, Netlify, or Vercel.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture (Current)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Radix UI components with Tailwind CSS
- **State Management**: React hooks and localStorage
- **Routing**: Wouter
- **Form Handling**: React Hook Form with Zod validation
- **Data Persistence**: Browser localStorage (no backend required)

### Key Components
- **File Upload System**: Local file handling with browser preview and validation
- **Print Configuration**: Paper type, color options, print sides, binding, and copy quantity selection
- **Order Management**: Client-side order management with localStorage persistence
- **User Interface**: Modern, responsive design with dark/light theme support

### Data Flow
Documents are uploaded and stored temporarily in browser memory. Print settings are configured and stored in localStorage. Orders are created and managed entirely client-side. All data persists across browser sessions using localStorage.

### Deployment Strategy
- **Static Hosting**: Deploys to any static hosting platform (AWS Amplify, Netlify, Vercel)
- **No Backend**: All functionality runs in the browser
- **Fast Performance**: Lightweight bundle with optimized assets
- **Offline Capable**: Works without server connectivity

## Current Dependencies
- **@radix-ui/***: Accessible UI components
- **@tanstack/react-query**: Client state management
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight routing
- **react-hook-form**: Form handling
- **zod**: Schema validation
- **lucide-react**: Icon library

## Recent Updates

### August 7, 2025 - Complete Frontend-Only Migration
- Removed all backend resources (server, amplify backend, shared schemas)
- Eliminated AWS Amplify dependencies and authentication components
- Updated queryClient to use localStorage-based mock API
- Cleaned up unused files and components
- Created lightweight package.json with frontend-only dependencies
- Updated amplify.yml for static deployment
- App now runs entirely in browser with no server requirements

### Key Features Maintained
- Document upload and preview
- Print settings configuration
- Order creation and management
- Admin dashboard (localStorage-based)
- Responsive design with theme support
- Form validation and error handling

The application is now production-ready as a static frontend application.