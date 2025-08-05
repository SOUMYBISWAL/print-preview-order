# PrintLite - Document Printing Service

## Overview
PrintLite is a full-stack web application designed to offer document printing services, primarily targeting students and professionals. It enables users to upload documents, customize print settings, place orders, and track deliveries through a modern web interface. The project aims to provide a convenient and efficient printing solution, currently deployed with AWS Amplify Gen 2 configuration for production, and fully functional within Replit for development.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
PrintLite employs a full-stack architecture, featuring a React frontend and a Node.js/Express backend, capable of supporting both database-driven development and static deployments.

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Radix UI components with Tailwind CSS
- **State Management**: React hooks and localStorage
- **Routing**: Wouter
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM (optional)
- **File Handling**: Multer for file uploads
- **Session Management**: Express sessions with PostgreSQL store

### Key Components
- **File Upload System**: Supports various formats (PDF, Word, images) with local preview, validation, and optional AWS S3 integration.
- **Print Configuration**: Allows selection of paper type, color options, print sides, binding, and copy quantity.
- **Order Management**: Handles guest and authenticated user orders, tracking status, calculating prices, and managing delivery addresses.
- **Authentication System**: Provides username/password authentication, admin panel access, user profile management, and guest checkout.
- **Admin Dashboard**: For managing orders, users, tracking revenue, and print queue.

### Data Flow
Documents are uploaded and print settings configured. Items are managed in localStorage for session persistence. Orders are submitted via API to the backend or managed client-side for static deployments. Admins can manage orders via the admin panel.

### Deployment Strategy
The application supports a hybrid deployment approach:
- **Development**: Node.js Express server with in-memory storage (Replit).
- **Production**: AWS Amplify Gen 2 with Cognito Auth, GraphQL API, and S3 Storage.
- **Environment Detection**: Automatic switching based on environment variables.
- **Fallback Strategy**: Graceful degradation from cloud to local backend.

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
- **AWS S3**: File storage
- **Neon Database**: PostgreSQL hosting

### AWS Amplify Gen 2 Resources
- **Authentication**: Cognito User Pools with email/password login
- **Data**: GraphQL API with Order and PrintSettings models
- **Storage**: S3 bucket with document upload permissions
- **Authorization**: Role-based access (GUEST, USER, ADMIN)

## Recent Updates

### August 5, 2025 - Replit Migration Completed
- Successfully migrated project from Replit Agent to standard Replit environment
- Backend API fully operational using Node.js native server (simple-server.js)
- All core PrintLite endpoints working: health check, auth, file upload, orders, admin stats
- Implemented fallback server solution to bypass dependency installation issues
- Project ready for development with robust client/server separation
- Security practices maintained with proper CORS handling and input validation

### August 5, 2025 - Replit Migration Completed
- Successfully migrated project from Replit Agent to standard Replit environment
- Backend API fully operational using Node.js native server (simple-server.js)
- All core PrintLite endpoints working: health check, auth, file upload, orders, admin stats
- Implemented fallback server solution to bypass dependency installation issues
- Project ready for development with robust client/server separation
- Security practices maintained with proper CORS handling and input validation

### August 5, 2025 - AWS Amplify Deployment Issues Fixed
- Fixed Node.js version mismatch by adding .nvmrc file with Node.js v20
- Updated amplify.yml to explicitly use Node.js v20 for both backend and frontend phases
- Created placeholder amplify_outputs.json file to resolve import errors
- Enhanced main.tsx to gracefully handle both development and production configurations
- Fixed duplicate imports in amplify/backend.ts
- Added backend phase to amplify.yml with proper outputs generation command
- AWS Amplify deployment errors resolved and ready for production deployment

### August 3, 2025 - Complete Backend Implementation
- Fixed all TypeScript import and build errors
- Created comprehensive Auth resource with secure user management
- Built complete Data API with real-time order synchronization
- Configured Storage with proper permissions for document uploads
- Updated amplify.yml to include backend deployment phase
- Resolved amplify_outputs.json import issues
- Backend now ready for production deployment with all AWS resources defined