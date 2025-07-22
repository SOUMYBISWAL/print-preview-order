# PrintLite - Document Printing Service

## Overview

PrintLite is a full-stack web application that provides document printing services with delivery options. The application is built as a modern React-based frontend with an Express.js backend, using PostgreSQL for data storage and Drizzle ORM for database operations.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for development and production builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Query (@tanstack/react-query) for server state
- **Routing**: React Router for client-side navigation
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Neon serverless connection
- **ORM**: Drizzle ORM for type-safe database operations
- **Session Storage**: PostgreSQL-based session storage
- **Development**: Hot reload with tsx for development server

### Project Structure
- `client/` - React frontend application
- `server/` - Express.js backend server
- `shared/` - Shared TypeScript types and schemas
- `migrations/` - Database migration files

## Key Components

### Database Schema
The application uses a simple user management system:
- **Users table**: Stores user credentials (id, username, password)
- Schema defined in `shared/schema.ts` with Zod validation
- Type-safe operations through Drizzle ORM

### Authentication & Storage
- Memory-based storage implementation for development (`MemStorage`)
- Interface-based storage design for easy swapping to database storage
- User authentication through username/password
- Session management with PostgreSQL store

### File Upload & Processing
- Support for multiple file formats (PDF, Word documents, images)
- Page counting functionality for pricing calculations
- Drag-and-drop file upload interface
- Print settings configuration (paper type, color, sides, copies)

### Print Management
- Multiple paper quality options (70 GSM, 90 GSM, 120 GSM)
- Color and black & white printing options
- Single/double-sided printing
- Bulk printing with quantity selection
- Shopping cart functionality with localStorage persistence

### Order Processing
- Complete checkout flow with customer information
- Delivery address management
- Order tracking system
- Admin panel for order management
- Payment method selection (UPI, cards)

## Data Flow

1. **File Upload**: Users upload documents through drag-and-drop interface
2. **Settings Configuration**: Users configure print settings (paper, color, sides)
3. **Cart Management**: Items added to cart with pricing calculations
4. **Checkout Process**: Customer information and delivery details collection
5. **Order Creation**: Order stored with unique ID for tracking
6. **Admin Management**: Orders viewable and manageable through admin panel

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for serverless deployment
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **react-router-dom**: Client-side routing
- **tailwindcss**: Utility-first CSS framework

### UI Dependencies
- **@radix-ui/\***: Accessible UI primitives
- **lucide-react**: Icon library
- **class-variance-authority**: Utility for component variants
- **clsx**: Conditional className utility

### Development Dependencies
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution for development
- **esbuild**: Production build bundling
- **@replit/vite-plugin-\***: Replit-specific development tools

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20
- **Database**: PostgreSQL 16
- **Port Configuration**: Application runs on port 5000
- **Hot Reload**: Enabled through Vite middleware in development

### Production Build
- **Frontend**: Built with Vite to `dist/public/`
- **Backend**: Bundled with esbuild to `dist/index.js`
- **Deployment Target**: Autoscale deployment on Replit
- **Static Assets**: Served through Express static middleware

### Database Configuration
- **Connection**: Neon serverless PostgreSQL
- **Migrations**: Managed through Drizzle Kit
- **Schema Push**: `npm run db:push` for schema updates

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment setting (development/production)

## Changelog

```
Changelog:
- June 27, 2025. Initial setup
- July 9, 2025. Migrated from Replit Agent to Replit environment
  - Fixed database connection using PostgreSQL
  - Updated file upload system to work with backend API
  - Integrated admin panel with backend order management
  - Ensured proper client/server separation for security
- July 11, 2025. Completed migration to Replit environment
  - Created PostgreSQL database and applied schema
  - Fixed dependency issues and environment configuration
  - Application successfully running on port 5000
  - Ready for continued development
- July 16, 2025. Added AWS Amplify deployment configuration
  - Created amplify.yml for proper build configuration
  - Added _redirects file for SPA routing support
  - Fixed 404 errors on client-side routes
  - Added comprehensive deployment documentation
  - Made database connection optional for development
- July 17, 2025. Fixed hybrid deployment compatibility and AWS backend
  - Resolved 404 API errors when deployed on AWS Amplify
  - Implemented dual-environment support (Replit + Amplify)
  - Created apiRequest handler for both backend and frontend-only deployments
  - Added localStorage fallback for order management on static deployments
  - Fixed order placement flow to work in both environments
  - Updated Admin and TrackOrder pages for deployment flexibility
  - Created GraphQL schema for AWS AppSync and DynamoDB
  - Added AWS Amplify backend configuration for automatic provisioning
  - Configured S3 storage for file uploads in AWS environment
- July 18, 2025. Fixed deployment issues and simplified build process
  - Removed problematic AWS backend deployment commands from amplify.yml
  - Fixed duplicate export errors in graphql-queries.ts that were causing build failures
  - Simplified amplify.yml to work without AWS backend configuration
  - Build process now works correctly for both Replit and Amplify deployments
  - Application ready for deployment with proper fallback to local storage
- July 20, 2025. Completed migration from Replit Agent to Replit environment
  - Fixed AWS Amplify deployment configuration for production builds
  - Updated amplify.yml with correct build commands (npx vite build)
  - Resolved TypeScript errors in GraphQL API handlers for production
  - Verified build process creates optimized dist/public directory
  - Added comprehensive AMPLIFY_DEPLOYMENT.md guide
  - Application now fully compatible with AWS Amplify hosting
- July 21, 2025. Migrated from AWS Amplify Gen 1 to Gen 2 architecture
  - Created new Gen 2 backend structure in amplify/ directory
  - Updated frontend to support both Gen 1 and Gen 2 configurations
  - Created Gen2FileUploader component with improved S3 storage integration
  - Modified queryClient to handle Gen 2 data client with fallback to Gen 1
  - Updated amplify.yml for Gen 2 deployment process
  - Added configuration files for Auth, Data, and Storage resources
  - Implemented backward compatibility for existing Gen 1 deployments
- July 22, 2025. Completed AWS Amplify backend setup and integration
  - Fixed "AWS credentials not found" errors with proper Gen 2 configuration
  - Created comprehensive backend resources (Auth, Data, Storage)
  - Implemented enhanced API routes with INR pricing calculations
  - Added automatic S3/local file upload detection and switching
  - Created detailed AWS deployment documentation
  - Ensured proper currency display (₹) throughout admin panel
  - Ready for AWS Amplify deployment with full functionality
- July 22, 2025. Successfully migrated from Replit Agent to Replit environment
  - Resolved tsx dependency issue by using working CommonJS server (simple-server.cjs)
  - Application now running successfully on port 5000 with all API endpoints functional
  - Order management, admin panel, and currency display (₹) working correctly
  - Migration complete with proper client/server separation and security practices
  - Ready for continued development and deployment
  - Fixed AWS Amplify deployment errors by updating npm configuration and using --force flag
  - Configured complete AWS Amplify Gen 2 backend with all services:
    * DynamoDB database with Order, User, UploadedFile, and SystemConfig models
    * S3 storage with secure user-isolated file access and admin management
    * GraphQL API with type-safe schema and authorization rules
    * Lambda functions for calculatePrice, updateOrderStatus, and processPayment
    * Authentication with Cognito User Pools and role-based access control
  - Enhanced API routes with INR pricing calculations and currency display
  - Implemented automatic S3/local file upload detection and switching
  - Ready for AWS Amplify deployment with full backend functionality
  - Fixed AWS Amplify build error by adding conditional directory checks in amplify.yml
  - Made backend build conditional to handle missing amplify directory gracefully
  - Deployment now succeeds as frontend-only if backend setup needs adjustments
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```