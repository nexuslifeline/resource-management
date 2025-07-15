# Resource Management System

The frontend uses Next.js 14 for its filesystem-based routing, nested layouts, and hybrid rendering (SSR + SPA). This ensures a fast, SEO-friendly experience with consistent UI and reusable components.

The backend is powered by Laravel, chosen for its intuitive Eloquent ORM, powerful validation, API resource classes, and secure token-based authentication via Sanctum. Laravel’s structure ensures clean business logic, organized controllers, and robust role-based access control.

## 🧱 Monorepo Structure

This project uses a monorepo setup and contains two main directories:

```bash
/
├── backend   # Laravel-based API
└── frontend  # Next.js 14 (App Router) application
```

Both projects are independently structured but work together as a full-stack solution.

## 🛠️ Project Architecture Overview

### 🔧 Backend (Laravel)

I chose Laravel for its powerful Eloquent ORM, which makes database operations intuitive with features like eager loading, relationships, and clean query syntax. The built-in migration system ensures smooth, version-controlled schema changes.

Laravel’s ecosystem is ideal for building APIs. Sanctum offers lightweight, stateless authentication perfect for SPAs, and the repository pattern helps keep business logic clean and testable. Form request validation and resource classes keep code organized and responses consistent.

With features like API versioning, middleware for access control, and built-in security protections, Laravel provides everything needed for a secure, scalable, and maintainable backend.

**Repository Pattern Implementation**: Business logic abstracted into repository classes, keeping controllers thin and focused on HTTP concerns.

- **Laravel Sanctum Bearer Token Authentication**: Stateless API authentication that scales well across domains, eliminating CSRF protection needs.

- **RESTful API Design with Versioning**: REST conventions with `/v1/` prefix for backward compatibility and easy API evolution.

- **Comprehensive Security Layer**: Rate limiting and middleware-based authorization protecting against abuse and unauthorized access.

- **Form Request Validation**: Centralized validation logic in dedicated request classes for clean, testable code.

- **Resource Class Transformation Layer**: API response transformation keeping controllers slim while ensuring consistent data formatting.

### 🖥️ Frontend (Next.js 14 with App Router)

I chose Next.js 14 for the frontend because of its intuitive filesystem-based routing, which simplifies navigation setup—just follow a folder structure and it's ready to go. The new App Router adds powerful support for nested layouts, making it easy to maintain consistent headers, navigation, and styles across pages.

What makes Next.js especially compelling is its hybrid rendering capability. For interactive parts like dashboards, it works like a single-page app with fast client-side navigation. For public-facing or SEO-critical pages like "About Us", it supports SSR and SSG, ensuring both performance and discoverability.

Lastly, its component-based architecture promotes clean, reusable code. UI elements are broken down into modular components, reducing duplication and making the project easier to scale and maintain.

- **Component-Based Architecture**: Reusable, self-contained components reducing duplication and enabling consistent design patterns.

- **Service Layer Abstraction**: Centralized API calls handling data transformation, error handling, and request/response formatting.

- **Zustand State Management**: Lightweight state management scaling from component state to application-wide data without boilerplate.

- **Two-Layer Validation System**: Zod schema validation with react-hook-form integration for immediate feedback and reduced API calls.

- **Hybrid SPA/SSR Approach**: Client-side navigation for dynamic content, SSR/SSG for SEO-optimized public pages.

## 📁 File Structure

### Backend (Laravel)

```arduino
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── DashboardController.php
│   │   │   ├── ResourceController.php
│   │   │   └── UserController.php
│   │   ├── Requests/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginRequest.php
│   │   │   │   └── RegisterRequest.php
│   │   │   ├── Resource/
│   │   │   │   ├── StoreResourceRequest.php
│   │   │   │   └── UpdateResourceRequest.php
│   │   │   └── User/
│   │   │       ├── StoreUserRequest.php
│   │   │       └── UpdateUserRequest.php
│   │   └── Middleware/
│   ├── Repositories/
│   │   ├── ResourceRepository.php
│   │   └── UserRepository.php
│   ├── Models/
│   │   ├── User.php
│   │   └── Resource.php
│   └── Http/Resources/
│       ├── UserResource.php
│       └── ResourceResource.php
├── routes/
│   └── api.php
├── database/
│   └── migrations/
└── config/
```

Organized with a focus on separation of concerns and extensibility.

Routes follow RESTful API standards and versioning (e.g., /api/v1/...).

### Frontend (Next.js 14 with App Router)

```graphql
frontend/
├── app/                    # Routing, layouts, and pages (App Router)
│   ├── (protected)/        # Protected routes requiring authentication
│   │   ├── dashboard/
│   │   ├── resources/
│   │   └── users/
│   ├── (public)/           # Public routes
│   │   ├── (site)/         # Site pages route group
│   │   │   ├── about/      # About page
│   │   │   ├── contact/    # Contact page
│   │   │   └── layout.jsx  # Shared site layout
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.jsx      # Public layout
│   └── layout.jsx          # Root layout
├── components/             # Reusable UI components
│   ├── common/             # Shared components (Button, Card, Table, etc.)
│   ├── forms/              # Form components
│   ├── layout/             # Layout components (Header, Sidebar, etc.)
│   └── containers/         # Page containers
├── shared/                 # Shared utilities and services
│   ├── services/           # API service layer
│   ├── constants/          # Application constants
│   └── lib/                # Utility functions
├── store/                  # Global state management (Zustand stores)
```

Designed for scalability and maintainability with modular layers.

API and state logic are fully abstracted to reduce coupling and simplify updates.

## 🚀 Quick Start

### Prerequisites

- PHP 8.1 or higher
- Node.js 18 or higher
- Composer
- MySQL/PostgreSQL database
- Docker & Docker Compose (for Docker setup)

### Setup Options

This project supports two setup approaches:

#### 🐳 **Option 1: Docker Setup (Recommended)**

The easiest way to get started with all services running in containers.

**Prerequisites:**

- Docker
- Docker Compose

**Quick Start with Docker:**

```bash
# Clone the repository
git clone <repository-url>
cd resource-management

# Make run script executable (Mac/Linux only)
chmod +x run.sh

# Execute the setup script
# On Windows: Use Git Bash to run ./run.sh
# On Mac/Linux: Use terminal to run ./run.sh
./run.sh
```

**Important:** You must use `./run.sh` for Docker setup as it contains additional commands for database initialization, Laravel setup, and migrations that are not available with standard `docker-compose` commands alone.

**What the script does:**

- Builds and starts all containers (Laravel, Next.js, MySQL)
- Waits for MySQL to be ready
- Installs Laravel dependencies
- Generates application key
- Runs database migrations and seeders
- Starts development servers

**Access your application:**

- **Laravel Backend**: http://localhost:8000
- **Next.js Frontend**: http://localhost:3000
- **MySQL Database**: localhost:3307 (user: root, password: 123456)

#### 💻 **Option 2: Local Development Setup**

For developers who prefer running services directly on their machine.

**Backend Setup (Laravel):**

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   composer install
   ```

3. **Environment setup:**

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Configure database in .env:**

   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=your_database_name
   DB_USERNAME=your_mysql_username
   DB_PASSWORD=your_mysql_password
   ```

5. **Run migrations:**

   ```bash
   php artisan migrate
   ```

6. **Seed database (optional):**

   ```bash
   php artisan db:seed
   ```

7. **Start the server:**
   ```bash
   php artisan serve
   ```

**Frontend Setup (Next.js):**

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment setup:**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables:**

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

**Access your application:**

- **Laravel Backend**: http://localhost:8000
- **Next.js Frontend**: http://localhost:3000

### Database Setup

**For Local Development:**

- Create a MySQL database with your preferred name
- Use your local MySQL username and password
- Update the credentials in your backend `.env` file
- Example: If your MySQL user is `john` with password `mypass123` and you created a database called `resource_management`, use those values in your `.env`

**For Docker:**

- Database is automatically created and configured
- Uses database name `resource` with user `root` and password `123456`
- No additional setup required

### Environment Variables

**Backend (.env):**

```env
APP_NAME="Resource Management"
APP_ENV=local
APP_KEY=base64:your-key-here
APP_DEBUG=true
APP_URL=http://localhost:8000

# For Local Development (use your own credentials)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password

# For Docker (pre-configured)
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=resource
# DB_USERNAME=root
# DB_PASSWORD=123456
```

**Frontend (.env.local):**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## 🔐 Authentication & Security

### Bearer Token Authentication

The application uses **Laravel Sanctum** with **Bearer Token Authentication** for secure API access:

- **Token Type**: Bearer tokens (JWT-like tokens)
- **Token Storage**: Stored in browser localStorage
- **Token Expiration**: **Long-lived tokens** (no expiration by default, valid until manually revoked). Can be easily configured in Laravel Sanctum for quick expiration by setting the `expiration` value in `config/sanctum.php`.
- **Cross-Domain Support**: Configured for cross-domain API calls without CSRF tokens

#### How It Works

1. **Login**: User authenticates with email/password and receives a bearer token
2. **Token Usage**: Frontend automatically includes `Authorization: Bearer {token}` header in all API requests
3. **Validation**: Backend validates the token on each request using Laravel Sanctum
4. **Logout**: Token is revoked on the backend and removed from localStorage

#### Token Security Features

- **Stateless**: No server-side session storage required
- **Automatic Cleanup**: Invalid tokens are automatically removed from localStorage
- **Secure Storage**: Tokens are stored in localStorage

### Rate Limiting

The API implements comprehensive rate limiting to prevent abuse:

- **Rate Limit**: **60 requests per minute** per user/IP address
- **Scope**: Applied to all API routes
- **Identification**: Rate limiting is based on authenticated user ID or IP address
- **Headers**: Rate limit information is included in response headers

### Role-Based Access Control

The system implements strict role-based permissions through custom middleware:

#### Custom Middleware Implementation

- **`CheckRole` Middleware**: Validates user roles before allowing access to specific routes. Administrators can access all endpoints, while regular users are restricted to their own resources.

- **`CheckResourceOwnership` Middleware**: Ensures users can only access, modify, or delete resources they own. Administrators bypass this restriction and have full access to all resources.

#### Administrator Role

- **Full Access**: Can view, create, edit, and delete all resources
- **User Management**: Can manage all users in the system
- **Dashboard Access**: Full access to all dashboard statistics
- **Resource Operations**: No restrictions on resource operations

#### Regular User Role

- **Resource Creation**: Can create new resources
- **Own Resource Access**: Can view, edit, and delete only their own resources
- **Limited Dashboard**: Access to user-specific dashboard statistics
- **Resource Assignment**: Can assign resources to other users (if permitted)

#### Resource Ownership Rules

- **Update/Delete Restrictions**:
  - **Administrators**: Can update/delete any resource
  - **Regular Users**: Can only update/delete resources they own
- **Middleware Protection**: `CheckResourceOwnership` middleware enforces these rules
- **API Enforcement**: All resource modification endpoints are protected

### Security Headers

The application includes essential security headers:

- **Authorization Header**: Protected routes require Authorization: Bearer <token> to access.
- **Content-Type**: Properly set for JSON responses
- **CORS Headers**: Configured for cross-domain requests
- **Rate Limit Headers**: Include rate limiting information

## 📝 API Endpoints

### Authentication

- `POST /api/v1/register` - User registration
- `POST /api/v1/login` - User login (returns bearer token)
- `POST /api/v1/logout` - User logout (revokes token)
- `GET /api/v1/me` - Get current authenticated user

### Resources

- `GET /api/v1/resources` - List resources (with filtering, sorting, pagination)
- `POST /api/v1/resources` - Create resource
- `GET /api/v1/resources/{id}` - Get resource details
- `PUT /api/v1/resources/{id}` - Update resource (admin or owner only)
- `DELETE /api/v1/resources/{id}` - Delete resource (admin or owner only)
- `GET /api/v1/resources/dashboard/stats` - Get resource statistics

### Users

- `GET /api/v1/users` - List users (administrator only)
- `GET /api/v1/users/{id}` - Get user details (administrator only)
- `GET /api/v1/users/assignment` - Get users for assignment (all authenticated users)

### Dashboard

- `GET /api/v1/dashboard` - Get dashboard statistics

## 🎨 UI Components

The frontend uses a comprehensive component library built with:

- **Next.js 14** with App Router
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Zustand** for state management
- **Custom components** for consistent UI

### Key Components

- **Table**: Advanced table with sorting, filtering, and pagination
- **FilterPopover**: Multi-select filter component
- **Sorter**: Sortable column headers
- **PaginationFooter**: Pagination controls
- **DropdownMenu**: Action menus
- **Card**: Content containers
- **Button**: Consistent button styling
- **Badge**: Status and role indicators

## 🔧 Development

### Code Style

- **Backend**: Follows PSR-12 coding standards
- **Frontend**: Uses ESLint and Prettier for code formatting

### State Management

- **Zustand stores** for global state management
- **Service layer** for API interactions
- **Local state** for component-specific data

### Error Handling

- **Backend**: Comprehensive error responses with proper HTTP status codes
- **Frontend**: Error boundaries and user-friendly error messages
- **API**: Consistent error format across all endpoints

## 🚀 Deployment

### Backend Deployment

1. Set up your production environment
2. Configure environment variables
3. Run migrations
4. Set up web server (Apache/Nginx)
5. Configure SSL certificates

### Frontend Deployment

1. Build the application:
   ```bash
   npm run build
   ```
2. Deploy to your hosting platform (Vercel, Netlify, etc.)
3. Configure environment variables
4. Set up custom domain (optional)
