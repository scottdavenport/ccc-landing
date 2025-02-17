# Changelog

## [Unreleased]

### Added
- Enhanced sponsor management in admin dashboard
  * Added PhotoGallery component with detailed image display
  * Implemented Cloudinary integration for image uploads
  * Added sponsor level selection with dynamic pricing
  * Added optimized thumbnail generation and display
  * Added single-file upload restriction for sponsor logos
  * Added sponsor metadata handling with optional website field

### Changed
- Improved database schema
  * Consolidated migrations into single initial schema file
  * Updated sponsors table with new fields for Cloudinary integration
  * Added proper constraints for required fields
  * Simplified sponsor image metadata storage

### Fixed
- Added Row Level Security (RLS) to all database tables
  * Enabled RLS on all public tables
  * Added public read access policies
  * Added authenticated user write access policies
  * Improved overall database security
- Fixed Supabase integration
  * Added proper error handling and debugging
  * Improved schema validation
  * Enhanced error messages for better debugging
  * Fixed issue with missing image_url column

### Documentation
- Updated README with setup instructions
- Added comprehensive error logging
- Added detailed comments for database schema
- Updated ROADMAP to reflect current project status
- Added detailed image management documentation

### Added
- Initial project setup with Next.js and TailwindCSS
- Basic component structure for Homepage
- ROADMAP.md for development guidance
- Design system planning based on golf-inspired themes
- Basic admin dashboard with overview metrics
- Quick action buttons for common admin tasks
- Interactive Supabase connection status with detailed connection info
- Toast notifications for connection status and errors
- Error boundaries for improved error handling and recovery
  - Added global error boundary
  - Added route-level error boundaries
  - Added component-level error boundaries for major components
- Authentication system for admin dashboard
  - Protected routes with authentication checks
  - Login page with Supabase Auth UI
  - User session management
  - Sign out functionality
- Role-based access control
  - Added user roles (admin, user)
  - Admin-only route protection
  - User profile management
  - Database schema for role management

### Changed
- Updated project structure to support new requirements
- Enhanced component organization for better maintainability

### Planned
- Implementation of dynamic date management system
- Enhanced sponsor showcase with tiered display
- Funds raised progress visualization
- Tournament countdown feature
