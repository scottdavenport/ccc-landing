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

This project uses Supabase for its backend. You'll need to set up the following environment variables in a `.env.local` file:

```sh
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

You can find these values in your Supabase project settings. The admin dashboard includes an interactive connection status indicator to help verify your Supabase configuration.

### Admin Access

The site includes a secure admin dashboard for managing tournament details and content. Admin access is controlled through Supabase user metadata, with role-based access control implemented. For security reasons, any unauthorized attempts to access admin pages will result in an automatic logout. Contact the project maintainers to request admin access.

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
