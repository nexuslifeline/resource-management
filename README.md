# Resource Management System

A modern, full-stack resource management application built with Laravel (backend) and Next.js 14 (frontend). This system provides comprehensive resource tracking, user management, and dashboard analytics with role-based access control.

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

- **Repository Pattern Implementation**: Business logic is abstracted into dedicated repository classes, keeping controllers thin and focused on HTTP concerns. This separation makes the codebase more maintainable and allows for easier unit testing of business rules without HTTP overhead.

- **Laravel Sanctum Bearer Token Authentication**: Provides stateless API authentication that scales well across multiple domains. Unlike session-based auth, bearer tokens eliminate the need for CSRF protection and work seamlessly in cross-origin scenarios, making them ideal for modern SPAs and mobile applications.

- **RESTful API Design with Versioning**: Endpoints follow REST conventions using semantic HTTP verbs, making the API intuitive for developers. The `/v1/` prefix enables backward compatibility when introducing breaking changes - existing clients continue working while new features can be deployed under `/v2/` without disruption.

- **Comprehensive Security Layer**: Rate limiting prevents API abuse by limiting requests per user/IP, while middleware-based authorization ensures proper access control. This multi-layered approach protects against both automated attacks and unauthorized data access.

- **Form Request Validation**: Server-side validation is implemented through Laravel's Form Request classes, which centralize validation logic and automatically handle error responses. This approach ensures data integrity regardless of client-side validation bypass attempts and provides consistent error formatting across all endpoints.

- **Resource Class Transformation Layer**: API responses are transformed using Laravel's Resource classes, which segregate data transformation logic from controllers. This approach keeps controllers slim and focused on HTTP concerns while ensuring consistent data formatting and hiding sensitive information from API responses.

### 🖥️ Frontend (Next.js 14 with App Router)

- **Component-Based Architecture**: UI elements are broken down into reusable, self-contained components that can be composed together. This approach reduces code duplication, improves maintainability, and enables consistent design patterns across the application.

- **Service Layer Abstraction**: API calls are centralized in dedicated service modules that handle data transformation, error handling, and request/response formatting. When backend contracts change, developers only need to update the service layer rather than hunting through multiple components.

- **Zustand State Management**: Provides lightweight, unopinionated state management that scales from simple component state to complex application-wide data. Unlike Redux, Zustand eliminates boilerplate while maintaining predictable state updates and excellent developer experience.

- **Two-Layer Validation System**: Frontend validation uses Zod schema validation with react-hook-form integration. Zod provides runtime type safety and schema validation, while react-hook-form handles form state management with minimal re-renders. This combination delivers immediate user feedback and reduces unnecessary API calls by catching validation errors before submission.

- **Backend Form Request Validation**: Server-side validation is implemented through Laravel's Form Request classes, which centralize validation logic and automatically handle error responses. This approach ensures data integrity regardless of client-side validation bypass attempts and provides consistent error formatting across all endpoints.

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
│   │   ├── login/
│   │   └── register/
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
└── utils/                  # Utility functions and helpers
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

The system implements strict role-based permissions:

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.
