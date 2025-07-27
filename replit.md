# PrintLite - Document Printing Service

## Overview

PrintLite is a full-stack web application that provides document printing services with a focus on students and professionals at CUTM Bhubaneswar. The application allows users to upload documents, configure print settings, place orders, and track deliveries through a modern web interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a full-stack architecture with a React frontend and Node.js/Express backend, designed to support both development with a database and static deployment without one.

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with Tailwind CSS styling
- **State Management**: React hooks and localStorage for persistence
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM (optional)
- **File Handling**: Multer for file uploads
- **Session Management**: Express sessions with PostgreSQL store

## Key Components

### 1. File Upload System
- Supports multiple file formats (PDF, Word, images)
- Local file handling with preview capabilities
- AWS S3 integration for file storage (configured but not actively used)
- File validation and size limits

### 2. Print Configuration
- Paper type selection (70GSM, 90GSM, 120GSM)
- Color options (black & white, color)
- Print sides (single, double)
- Binding options (none, spiral, staple)
- Copy quantity management

### 3. Order Management
- Guest and authenticated user orders
- Order status tracking (pending, processing, printing, shipped, delivered)
- Price calculation based on pages, paper type, and options
- Delivery address management

### 4. Authentication System
- Simple username/password authentication
- Admin panel access with special credentials
- User profile management
- Guest checkout capabilities

### 5. Admin Dashboard
- Order management and status updates
- User management
- Revenue tracking and analytics
- Print queue management

## Data Flow

1. **File Upload**: Users upload documents through the FileUploader component
2. **Print Settings**: Users configure print options on the PrintSettings page
3. **Cart Management**: Items stored in localStorage for session persistence
4. **Order Processing**: Orders submitted via API to backend or localStorage
5. **Admin Management**: Admins can view and update orders through the admin panel

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database queries and migrations
- **@tanstack/react-query**: Server state management
- **@radix-ui**: Accessible UI components
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **tsx**: TypeScript execution for development
- **vite**: Frontend build tool and dev server
- **drizzle-kit**: Database migration management

### Optional Services
- **AWS S3**: File storage (configured but not required)
- **Neon Database**: PostgreSQL hosting (optional for static deployment)

## Deployment Strategy

The application supports two deployment modes:

### 1. Full-Stack Deployment
- Backend server with database connectivity
- Real-time order processing and admin management
- File upload to cloud storage
- Session-based authentication

### 2. Static Deployment (AWS Amplify)
- Frontend-only deployment without backend dependencies
- localStorage-based data persistence
- Simulated order processing
- Client-side file handling

### Build Configuration
- **Development**: Uses tsx for TypeScript execution
- **Production**: Vite build with esbuild for backend bundling
- **Static Build**: Custom build script for frontend-only deployment

The architecture is designed to gracefully handle missing database connections by falling back to localStorage-based operations, making it suitable for both dynamic and static hosting environments.

## Recent Cleanup (July 27, 2025)

Successfully removed all backend resources and deployment configuration files:
- ✓ Removed AWS Amplify backend configuration (amplify/ directory)
- ✓ Deleted all deployment documentation files (15+ MD files)
- ✓ Cleaned up server-side backup files and configs
- ✓ Removed S3 configuration and external service integrations
- ✓ Simplified project structure to core PrintLite functionality
- ✓ Application running cleanly on Replit Express server (port 5000)
- ✓ Fixed AWS Amplify deployment errors with proper Node.js version and npm configuration
- ✓ Added clean build configuration for frontend-only deployment
- ✓ Removed all AWS Amplify backend configuration and deployment files
- ✓ Simplified to focus purely on Replit-hosted application with Express backend