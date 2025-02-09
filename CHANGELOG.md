# Changelog

All notable changes to the Craven Cancer Classic website will be documented in this file.

## [Unreleased]

### Added
- Supabase integration for database and authentication
  - User authentication and profile management
  - Tournament registration system
  - Donation tracking
  - Sponsor management
  - Tournament history tracking
- Database schema with Row Level Security
- React hooks for database operations
- Authentication context and provider
- Type definitions for database schema

### Changed
- Updated project dependencies
- Added Supabase client configuration

### Security
- Implemented Row Level Security policies for all database tables
- Secure authentication flow with Supabase Auth
- Protected routes and admin-only operations
