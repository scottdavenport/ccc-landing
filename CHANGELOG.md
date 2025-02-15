# Changelog

All notable changes to the Craven Cancer Classic website will be documented in this file.

## [Unreleased]
### Added
- Enhanced photo management in admin dashboard
  * Added PhotoGallery component with detailed image display
  * Implemented debug information panel
  * Added Cloudinary resource listing API
  * Improved photo upload widget with auto-refresh
  * Added optimized thumbnail generation and display
  * Improved grid layout for better thumbnail presentation
  * Added single-file upload restriction for sponsor logos
  * Improved sponsor metadata handling with optional website field

### Changed
- Simplified application architecture
  * Removed authentication system
  * Made admin dashboard publicly accessible
  * Updated environment configuration to focus on Cloudinary

### Fixed
- Fixed Cloudinary integration
  * Improved image upload and display
  * Added proper error handling
  * Enhanced debugging capabilities

### Documentation
- Updated README with Cloudinary setup instructions
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
