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

### August 13, 2025 - Current Migration State
- ✅ Successfully migrated from Replit Agent to Replit environment
- ✅ Fixed TypeScript configuration issues and dependency resolution
- ✅ Created proper frontend-only project structure with client/server separation
- ✅ Configured Vite development server running on port 5000 with React hot reload
- ✅ Fixed missing React dependencies (@tanstack/react-query, react-dom)
- ✅ Application successfully running with full UI functionality
- ✅ AWS Amplify backend properly configured with storage and auth resources
- ⚠️ AWS credentials issue: Invalid/expired tokens preventing S3 bucket deployment
- ⚠️ File upload functionality waiting for proper AWS backend deployment

### Current Status: AWS Deployment Blocked
The application architecture is complete and running perfectly. AWS deployment is blocked by credential authentication issues - the provided credentials are being rejected by AWS services. Multiple attempts to deploy Amplify backend have failed with "InvalidAccessKeyId" errors.

**Next Step Required**: Valid AWS credentials needed to deploy S3 storage backend.

### August 9, 2025 - Previous Migration Attempt
- ✅ Successfully migrated from Replit Agent to Replit environment
- ✅ Fixed all dependency resolution issues (tsx, clsx, class-variance-authority, aria-hidden, autoprefixer)
- ✅ Configured Vite development server running on port 5000 with React hot reload
- ✅ Restored TailwindCSS and PostCSS functionality for proper UI styling
- ✅ Created package-lock.json for AWS Amplify compatibility
- ✅ Updated amplify.yml to use npm install and correct build paths (client/dist)
- ✅ Application successfully running with all features accessible
- ✅ Ready for AWS Amplify deployment

## Previous Updates

### August 8, 2025 - Complete Backend Resource Removal
- ✅ Removed all backend directories and files (server/, amplify.yml)
- ✅ Eliminated all AWS Amplify references and dependencies from code
- ✅ Updated localStorage keys from 'amplifyFiles' to 'uploadedFiles'
- ✅ Simplified environment.ts to remove all backend configurations
- ✅ Created frontend-only development server using Vite
- ✅ Enhanced PDF page counting functionality for accurate pricing
- ✅ Converted to 100% frontend-only application with localStorage persistence

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