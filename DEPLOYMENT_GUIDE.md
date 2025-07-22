# Complete AWS Amplify Backend Deployment Guide

## Backend Services Configured ✅

### 🗄️ Database (Amazon DynamoDB)
- **Order Management**: Complete order tracking with status updates
- **User Management**: User profiles with role-based access (user/admin)
- **File Tracking**: Uploaded file metadata and associations
- **System Configuration**: Admin settings for pricing and general config

### 📁 Storage (Amazon S3)
- **Secure File Storage**: Users can only access their own uploaded files
- **Admin Access**: Admin users have full access to all files for printing
- **Organized Structure**:
  - `uploads/{user_id}/*` - User-specific file uploads
  - `orders/{user_id}/*` - Order-related files
  - `admin/*` - Admin-only system files
  - `public/*` - Publicly accessible files
  - `processed/*` - Processed files for download

### 🔗 API (AWS AppSync - GraphQL)
- **Type-safe Schema**: Complete GraphQL schema with all PrintLite models
- **Security**: User-based and admin-based authorization rules
- **Real-time**: Support for real-time updates on order status changes

### ⚡ Functions (AWS Lambda)
1. **calculatePrice**: Determines printing costs based on:
   - Paper type (A4, A3, Letter)
   - Quality (70GSM, 90GSM, 120GSM)
   - Print type (color/B&W)
   - Pages and copies
   - Includes 18% GST calculation

2. **updateOrderStatus**: Admin function to update order status:
   - Status progression: pending → processing → printing → ready → shipped → delivered
   - Admin notes capability
   - Audit trail

3. **processPayment**: Payment processing integration:
   - UPI, Card, and Cash payment methods
   - Transaction ID generation
   - Payment status tracking

## Pricing Structure (INR)
- **Black & White**: ₹2 per page
- **Color**: ₹8 per page
- **Paper Quality Multipliers**:
  - 70GSM: 1.0x (standard)
  - 90GSM: 1.2x (+20%)
  - 120GSM: 1.5x (+50%)
- **Paper Size Multipliers**:
  - A4/Letter: 1.0x
  - A3: 2.0x (double)
- **GST**: 18% on all orders

## User Access Control
### Regular Users Can:
- Upload files to their own folders
- Create print orders
- View their own orders
- Process payments
- Track order status

### Admin Users Can:
- View all orders and files
- Update order status
- Access admin-only files
- Manage system configuration
- Generate reports

## Deployment Steps

1. **Enable Backend**: Backend deployment is now configured in amplify.yml
2. **Deploy to AWS**: Push your code to trigger Amplify deployment
3. **Initialize Database**: Schema will be automatically created
4. **Configure Admin**: First user should be assigned admin role manually

## Environment Setup
```bash
# The backend is now fully configured with:
- Authentication (Cognito User Pools)
- Database (DynamoDB with GraphQL)
- Storage (S3 with secure access)
- Functions (Lambda for business logic)
```

## Ready for Production ✅
Your PrintLite application now has a complete AWS backend that handles:
- Secure file uploads with user isolation
- Complete order management workflow
- Admin panel functionality
- Payment processing
- Real-time price calculations
- Currency display in INR (₹)

Deploy to AWS Amplify and your printing service will be fully functional!