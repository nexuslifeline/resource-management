# Resource Management Frontend

A modern, responsive frontend for the Resource Management System built with Next.js 14, JavaScript, Tailwind CSS, and Shadcn/ui.

## Features

- 🔐 **Authentication**: Login and registration with JWT tokens
- 📊 **Dashboard**: Overview of system status and quick actions
- 📋 **Resources Management**: View, search, and manage resources
- 🎨 **Modern UI**: Beautiful interface built with Shadcn/ui components
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🔄 **State Management**: Zustand for global state management
- ✅ **Form Validation**: React Hook Form with Zod schema validation

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see backend README)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── resources/        # Resources management page
│   ├── globals.css       # Global styles
│   ├── layout.jsx        # Root layout
│   └── page.jsx          # Home page (redirects to login/dashboard)
├── components/           # Reusable components
│   ├── ui/              # Shadcn/ui components
│   └── layout/          # Layout components
├── lib/                 # Utility libraries
│   └── auth.js          # Authentication utilities
└── store/               # Zustand stores
    └── auth.js          # Authentication state management
```

## Pages

### Authentication Pages

- **Login** (`/login`): User authentication with email and password
- **Register** (`/register`): New user registration
- **Home** (`/`): Redirects to dashboard if authenticated, otherwise to login

### Protected Pages

- **Dashboard** (`/dashboard`): Overview with user info and quick actions
- **Resources** (`/resources`): Resource management with search and filtering

## Components

### UI Components (Shadcn/ui)

- `Button`: Versatile button component with multiple variants
- `Input`: Form input component
- `Card`: Content container with header and body sections
- `Loading`: Loading spinner component

### Layout Components

- `Navbar`: Navigation bar with user info and logout
- `AuthenticatedLayout`: Wrapper for protected pages

## State Management

### Auth Store (Zustand)

The authentication state is managed using Zustand with persistence:

```javascript
// State structure
{
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
}
```

## API Integration

The frontend communicates with the Laravel backend API:

- **Base URL**: Configurable via `NEXT_PUBLIC_API_URL` environment variable
- **Authentication**: JWT tokens stored in localStorage
- **Interceptors**: Automatic token inclusion and 401 handling

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **CSS Variables**: Custom design tokens for consistent theming
- **Responsive Design**: Mobile-first approach with breakpoint utilities

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

### Code Style

- **JavaScript**: Modern ES6+ syntax
- **ESLint**: Next.js recommended configuration
- **Prettier**: Code formatting (if configured)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000/api` |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 