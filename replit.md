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
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```