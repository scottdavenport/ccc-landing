# 🏌️‍♂️ Craven Cancer Classic Website

Welcome to the Craven Cancer Classic (CCC) website repository! This project serves as the official web presence for our annual golf tournament that supports cancer patients through the power of golf.

## 🌟 Overview

The CCC website is built with modern web technologies to provide an engaging, responsive experience for our supporters, sponsors, and participants. It features a golf-inspired design system with smooth animations and intuitive navigation.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/cb6768b4-f262-4945-bc6f-e2177156f244) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Environment Configuration

This project uses Cloudinary for image management. You'll need to set up the following environment variables in a `.env.local` file:

```sh
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Image Management

The project uses Cloudinary for efficient image management. Here's how it works:

### Admin Dashboard
- Access the admin dashboard at `/admin`
- Use the modern modal dialog to upload sponsor logos
- Preview uploaded images with optimized display
- Manage sponsor metadata and information
- View all uploaded images with detailed information
- Select and delete multiple images with confirmation
- Images are automatically optimized by Cloudinary

### Documentation
- Comprehensive JSDoc documentation available in the `docs/` directory
- Detailed TypeScript types and interfaces

### Cloudinary Setup
1. Create a Cloudinary account
2. Create an upload preset named 'sponsors'
3. Configure the preset:
   - Set to 'Unsigned' uploading
   - Set folder to 'sponsors'
   - Enable image optimization
4. Add your Cloudinary credentials to `.env.local`

You can find your Cloudinary credentials in your Cloudinary dashboard. The admin dashboard includes debug information to help verify your Cloudinary configuration and view uploaded images.

## Development

To ensure a smooth development experience, we've added a `dev:safe` script that:
1. Checks for and kills any existing processes on ports 3000-3002
2. Runs the build to catch any type errors
3. Starts the development server if build succeeds

Use this command instead of the regular `dev` script:
```sh
npm run dev:safe
```

### Admin Access

The site includes a secure admin dashboard for managing tournament details, users, and content. Admin access is controlled through Supabase user metadata, with role-based access control implemented. For security reasons, any unauthorized attempts to access admin pages will result in an automatic logout.

Admin features include:
- User management interface for viewing and monitoring user accounts
- Role-based access control
- Interactive connection status monitoring with real-time authentication state
- Secure admin-only operations using service role client

Contact the project maintainers to request admin access.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## 🛠️ Technology Stack

This project leverages modern web technologies for optimal performance and maintainability:

- **Vite** - Next Generation Frontend Tooling
- **TypeScript** - For type-safe code
- **React** - UI Component Library
- **shadcn-ui** - Beautifully designed components
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - For smooth animations

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/cb6768b4-f262-4945-bc6f-e2177156f244) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
