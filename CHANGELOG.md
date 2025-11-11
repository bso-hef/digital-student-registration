# Changelog

All notable changes to the Digital Student Registration project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-11

### Added

#### Core Infrastructure (#1)

- **Next.js 15 Full-Stack Application**
  - Next.js 15.4.2 with App Router architecture
  - TypeScript 5 for type safety across the codebase
  - Integrated API Routes as backend (no separate Express server)
  - HTTPS development server with SSL certificates
  - MongoDB 8.18.0 integration via Mongoose
  - Connection pooling with retry logic and exponential backoff

- **State Management System**
  - Redux Toolkit 2.8.2 for centralized state management
  - Redux Persist 6.0.0 for localStorage persistence
  - Thunk actions for async operations
  - State slices: ui, student, class, appSettings
  - Error handling with AppError type system

- **Theme System**
  - Material-UI v7.2.0 with Emotion 11.14.0 styling
  - Light/Dark mode support with system detection
  - Custom color palettes and typography system
  - Theme factory function for dynamic theme generation
  - Persistent theme preferences

- **Internationalization (i18n)**
  - i18next 25.3.2 integration
  - Bilingual support (English & German)
  - Browser language auto-detection
  - 400+ translation keys
  - Language switcher component

- **Development Infrastructure**
  - ESLint with Next.js and TypeScript rules
  - Prettier code formatting with pre-commit hooks
  - TypeScript path aliases (@/\* for absolute imports)
  - Winston 3.17.0 for server-side logging
  - Sonner 2.0.6 for toast notifications

#### Admin Authentication & Authorization (#9)

- **NextAuth.js 5.0.0-beta.30 Integration**
  - Secure admin login with bcrypt password hashing
  - JWT-based session management
  - Password reset functionality
  - Initial admin setup wizard
  - Protected routes with middleware
  - User model with secure password storage
  - Setup status tracking to enforce initial configuration

- **Auth API Routes**
  - `/api/auth/[...nextauth]` - NextAuth endpoints (login, logout, session)
  - `/api/auth/setup` - Initial admin setup wizard
  - `/api/auth/setup/complete` - Complete setup process
  - `/api/auth/setup/clear` - Reset setup (development only)
  - `/api/auth/reset-password` - Password reset endpoint

#### Admin Dashboard (#6)

- **Real-Time Statistics Widget**
  - Total students, classes, and active students count
  - Student status distribution (active, pending, completed, inactive)
  - Class distribution by grade level (1-13)
  - Registration trend charts with date filtering
  - Visual data representation using @mui/x-charts

- **System Health Monitoring**
  - Database connection status
  - API response time monitoring
  - Memory usage tracking
  - Health check endpoints (`/api/health/live`, `/api/health/full`)

- **Drag-and-Drop Dashboard Layout**
  - Customizable widget arrangement
  - Persistent layout preferences in Redux
  - Responsive grid system for mobile/tablet
  - Real-time statistics updates

#### Class Management (#1, #6)

- **Class CRUD Operations**
  - Create, read, update, delete classes
  - Batch create multiple classes
  - Batch delete with confirmation
  - Paginated class list with search/filter
  - Class detail pages with student roster

- **Class Model Features**
  - Grades 1-13 support with validation
  - Vocational training program flag (`isVocational`)
  - School year tracking (from/to dates)
  - Active/inactive status management
  - Student count tracking
  - Unique constraint on year range + class name
  - Pre-save validation hooks

- **Class API Routes**
  - `GET /api/classes` - Paginated class list (supports skip, limit)
  - `POST /api/classes` - Batch create with validation
  - `DELETE /api/classes` - Batch delete by IDs
  - `GET /api/classes/[classId]` - Fetch single class details
  - `PATCH /api/classes/[classId]` - Update class information
  - `DELETE /api/classes/[classId]` - Delete single class
  - `GET /api/classes/[classId]/students` - Get class roster
  - `POST /api/classes/[classId]/students` - Add students to class

- **Class Management UI**
  - DataTable component with sorting and filtering
  - ClassStatus chip component with color coding
  - Add/Edit class modals with Formik validation
  - Student roster management per class
  - Bulk operations toolbar

#### Student Management (#1, #6)

- **Student CRUD Operations**
  - Create, read, update, delete students
  - Batch create with CSV import support
  - Batch delete with confirmation
  - Advanced search with name normalization
  - Paginated student list (10-20 items per page)

- **Student Model Features**
  - Normalized search fields (removes diacritics, case-insensitive)
  - Compound index on `firstNameNorm + lastNameNorm + dateOfBirth`
  - Address schema with automatic timezone detection (based on country code)
  - Class history tracking with date ranges
  - Employer information for vocational students
  - Pre-save hooks for data validation
  - Profile avatar support (placeholder)

- **Data Export Features**
  - Export student data to PDF (jsPDF 3.0.3)
  - Export to Excel/CSV format
  - Bulk export with filtering options
  - QR code generation for student invitations (qrcode 1.5.4)
  - ZIP archive creation for bulk downloads (jszip 3.10.1)

- **Student API Routes**
  - `GET /api/students` - Paginated student list
  - `POST /api/students` - Batch create with name normalization
  - `DELETE /api/students` - Batch delete by IDs
  - `GET /api/students/[id]` - Fetch single student details
  - `PATCH /api/students/[id]` - Update student information
  - `POST /api/students/verify` - Verify unique student token
  - `PATCH /api/students/[id]/onboarding` - Submit onboarding data

- **Student Management UI**
  - DataTable with advanced filtering (name, class, status)
  - StudentStatus chip component
  - Add/Edit student modals
  - CSV import wizard with validation
  - Export options dropdown
  - QR code invitation generator

#### Audit Logging System (#6)

- **Comprehensive Activity Tracking**
  - All CRUD operations logged automatically
  - User action history with timestamps
  - Action types: CREATE, UPDATE, DELETE, LOGIN, LOGOUT, EXPORT, IMPORT
  - User attribution for all actions
  - Entity tracking (Student, Class, User, Settings)
  - Request metadata (IP, user agent, method, path)

- **Audit Log Features**
  - Filter by action type, date range, user, entity
  - Paginated audit log viewer
  - Export audit logs to CSV
  - Audit statistics and analytics
  - Retention policy configuration

- **Audit Log API Routes**
  - `GET /api/audit-logs` - Paginated audit log list
  - `DELETE /api/audit-logs` - Batch delete old logs
  - `GET /api/audit-logs/stats` - Audit statistics
  - `GET /api/audit-logs/export` - Export to CSV

- **AuditLog Model**
  - User reference with cascade behavior
  - Entity type and entity ID tracking
  - Request details (IP, user agent)
  - Timestamp with automatic indexing

#### Admin Settings (#1, #6, #7)

- **Onboarding Configuration**
  - Customize student onboarding form fields
  - Enable/disable specific form sections
  - Dropdown options management:
    - Countries, genders, nationalities
    - Education levels, school types
    - Relationship types (for parents/guardians)
  - Field-level configuration (required/optional)
  - Form step ordering

- **Agreement Management (#7)**
  - Create custom agreements/consent forms
  - Rich text editor for agreement content
  - Version control for agreements
  - Require acceptance during student onboarding
  - Track agreement acceptance history per student
  - Agreement status (active/inactive)
  - Multiple agreements support

- **System Settings**
  - General application configuration
  - Integration placeholders (email, SMS, analytics)
  - Audit log retention policies
  - Date/time format preferences
  - Default language and timezone

- **Settings API Routes**
  - `GET /api/settings` - Fetch general settings
  - `PATCH /api/settings` - Update general settings
  - `GET /api/settings/onboarding` - Fetch onboarding configuration
  - `PATCH /api/settings/onboarding` - Update onboarding config
  - `GET /api/settings/agreements` - List all agreements
  - `POST /api/settings/agreements` - Create new agreement
  - `PATCH /api/settings/agreements/[id]` - Update agreement
  - `DELETE /api/settings/agreements/[id]` - Delete agreement

- **AppSettings Model**
  - Singleton pattern (only one settings document)
  - Nested schemas for onboarding and integrations
  - Default values for all settings
  - Validation for required fields

#### Accessibility Features (#6)

- **Accessibility Menu Component**
  - Dark/Light mode toggle
  - High contrast mode
  - Dyslexia-friendly font option (OpenDyslexic)
  - System theme auto-detection
  - Language switcher (EN/DE)
  - Persistent preferences in localStorage and Redux

- **Responsive Design**
  - Mobile-first approach
  - Breakpoints: xs(0), sm(600), md(960), lg(1280), xl(1920)
  - Touch-friendly interactions
  - Adaptive layouts for tablets and phones
  - Mobile drawer navigation
  - Collapsible sidebar on desktop

- **WCAG Compliance Efforts**
  - Semantic HTML structure
  - ARIA labels and roles
  - Keyboard navigation support
  - Focus management
  - Color contrast ratios
  - Screen reader friendly

#### Student Onboarding Wizard (#7)

- **Multi-Step Registration Form (11 Steps)**
  1. **WelcomeForm** - Introduction and instructions
  2. **GeneralForm** - Personal information (name, DOB, gender, nationality)
  3. **AddressForm** - Contact information (street, city, postal code, country, phone, email)
  4. **OriginForm** - Birth place and country of origin
  5. **ParentsForm** - Guardian information (names, relationships, contact details)
  6. **PreEducationForm** - Previous education history (schools, qualifications)
  7. **TrainingForm** - Current class/program enrollment
  8. **CompanyContactForm** - Employer details (vocational students only)
  9. **SummaryForm** - Review all information before submission
  10. **AgreementsForm** - Accept required agreements/consents
  11. **CompletionForm** - Success confirmation with next steps

- **Form Features**
  - Step-by-step progress indicator with visual feedback
  - Form validation with Yup schemas (yup 1.7.0)
  - Formik 2.4.6 integration for form state management
  - formik-mui components for Material-UI integration
  - Country autocomplete with flag icons
  - Date pickers with localization (Day.js 1.11.18, @mui/x-date-pickers 8.12.0)
  - Conditional fields (e.g., company info only for vocational students)
  - Real-time validation feedback
  - Save progress to Redux state
  - Beautiful animated background pattern
  - Mobile-responsive layouts

- **Unique Invitation System**
  - Admin-generated QR codes with unique student IDs
  - Secure student verification via unique tokens
  - Direct link access with verification code
  - Auto-populate student information upon verification
  - Prevents duplicate registrations
  - Token expiration support

- **Validation System**
  - `validateGeneralStudentData` schema in `src/lib/validate/student.validate.ts`
  - Email format validation
  - Phone number format validation
  - Date range validation (DOB, school years)
  - Required field enforcement
  - Conditional validation (employer info for vocational students)

#### Responsive Admin UI (#6)

- **LeftNavigation Component**
  - Collapsible sidebar navigation for desktop
  - Mobile drawer with swipe gesture support
  - Active route highlighting
  - Nested menu support with expansion
  - Sections: Dashboard, Management (Classes, Students), Settings
  - Persistent collapsed state in Redux
  - Smooth animations and transitions

- **AdminHeader Component**
  - User profile menu with logout
  - Notifications badge (placeholder for future features)
  - Breadcrumb navigation
  - Responsive layout

- **DataTable Component**
  - Reusable table for all data lists
  - Column sorting (ascending/descending)
  - Advanced filtering with search
  - Row selection with checkboxes
  - Bulk action toolbar
  - Pagination with configurable page size
  - Empty state handling
  - Loading states with skeletons

#### Testing Infrastructure (#6)

- **Unit Testing (Vitest 4.0.3) - 964 Tests**
  - Atomic design pattern tests:
    - **Atoms**: 723 tests (buttons, inputs, dropdowns, status chips, logo, etc.)
    - **Molecules**: 106 tests (headers, menus, collapsed sections, breadcrumbs)
    - **Organisms**: 135 tests (forms, tables, modals, navigation, wizards)
  - Utility function tests (general, styling, notification, validation)
  - Redux reducer and action tests
  - Mock router from test-utils for consistent testing

- **Test Coverage Tracking**
  - Statements: 21.78%
  - Branches: 29.21%
  - Functions: 22.54%
  - Lines: 22.02%
  - Auto-updating coverage thresholds
  - HTML coverage reports

- **Test Infrastructure**
  - @testing-library/react 16.3.0
  - @testing-library/jest-dom 6.9.1
  - @testing-library/user-event 14.6.1
  - Mock Service Worker (MSW) 2.11.6 configured
  - mongodb-memory-server for integration tests (disabled)
  - Centralized test utilities in `tests/utils/test-utils.tsx`

#### Component Library & Storybook (#6)

- **Storybook 8.5.4 Integration**
  - Visual component documentation
  - Interactive component playground
  - 50+ component stories across atomic design levels
  - Accessibility testing with @storybook/addon-a11y
  - Theme switching support (light/dark)
  - Responsive viewport testing
  - Controls for component props
  - Actions logging for event handlers

- **Component Categories**
  - Atoms: Basic UI elements
  - Molecules: Composed components
  - Organisms: Complex features
  - Forms: All form components with validation examples

#### Documentation (#6)

- **Comprehensive Documentation Suite**
  - **ARCHITECTURE.md** - System design, patterns, and architectural decisions
  - **API.md** - Complete API reference with request/response examples
  - **COMPONENTS.md** - Component library documentation with usage examples
  - **DATABASE.md** - Schema documentation, indexes, and relationships
  - **SETUP.md** - Development environment setup guide
  - **TESTING.md** - Testing guide, best practices, and troubleshooting
  - **DEPLOYMENT.md** - Production deployment guide and considerations
  - **TROUBLESHOOTING.md** - Common issues and solutions
  - **ONBOARDING.md** - Student onboarding flow documentation

- **Code Quality Documentation**
  - ESLint configuration explained
  - Prettier rules and conventions
  - TypeScript best practices
  - Git commit message guidelines

#### Database Layer (#1, #6)

- **MongoDB Connection Management**
  - Global connection caching to prevent connection pool exhaustion
  - Retry logic with exponential backoff (max 5 retries)
  - Connection state event listeners (connected, error, disconnected)
  - Graceful error handling
  - Connection pooling configuration

- **Mongoose Models**
  - **Student**: Personal info, address with timezone, education history, employer info, class assignments
  - **Class**: Grade (1-13), school year range, vocational flag, student roster
  - **User**: Admin authentication with bcrypt hashed passwords, roles
  - **AuditLog**: Activity tracking with user attribution
  - **AppSettings**: Application configuration (singleton pattern)

- **Data Validation & Normalization**
  - Pre-save hooks for data integrity
  - Name normalization for reliable searching (removes diacritics, lowercase)
  - Timezone auto-detection based on country code
  - School year validation (from < to)
  - Employer info validation for vocational students
  - Unique constraints and compound indexes

- **Generic CRUD Helpers**
  - `src/server/middleware/db.middleware.ts` provides reusable functions
  - `getItem()`, `getItems()` with pagination support
  - `createItem()`, `updateItem()`, `deleteItem()`
  - Lean queries for performance
  - Populate support for references
  - Filter and sort capabilities

- **Pagination Support**
  - mongoose-paginate-v2 1.9.1 integration
  - Configurable page size
  - Total count and page count
  - Skip and limit parameters

#### Utilities & Helpers (#1, #6)

- **Notification System**
  - Toast notifications using Sonner 2.0.6
  - Success, error, warning, info, and loading notifications
  - Wrapper functions in `src/utils/notification.utils.ts`
  - Consistent styling and positioning
  - Auto-dismiss with configurable duration

- **General Utilities**
  - File handling utilities
  - URL validation
  - Browser detection (Chrome, Firefox, Safari)
  - Date formatting with Day.js
  - String manipulation (capitalization, truncation)
  - Debounce and throttle functions

- **Styling Utilities**
  - Scrollbar styling helpers
  - Theme-aware utility functions
  - Responsive breakpoint helpers
  - Color manipulation utilities

- **Validation Utilities**
  - Yup schemas for all forms
  - Email validation
  - Phone number validation
  - Date range validation
  - Conditional validation based on field values

#### API Routes Structure (#1, #6, #7, #9)

All API routes follow RESTful conventions with proper error handling and validation:

- **Classes API** (`/api/classes/`)
- **Students API** (`/api/students/`)
- **Dashboard API** (`/api/dashboard/`)
- **Audit Logs API** (`/api/audit-logs/`)
- **Settings API** (`/api/settings/`)
- **Auth API** (`/api/auth/`)
- **Health API** (`/api/health/`)

Each API route includes:

- Request validation with detailed error messages
- Error handling with AppError type
- Audit logging for all mutations
- Pagination support where applicable
- Proper HTTP status codes

#### Code Quality Tools (#1, #6)

- **ESLint Configuration**
  - Next.js recommended rules
  - TypeScript-specific rules
  - React hooks rules
  - Storybook plugin
  - Import order enforcement

- **Prettier Configuration**
  - Consistent code formatting across the project
  - Import sorting with prettier-plugin-sort-imports
  - Pre-commit hooks with Husky (if configured)
  - Format on save integration

- **TypeScript Configuration**
  - Strict mode enabled
  - Path aliases (@/\* for src/ directory)
  - Custom type definitions
  - Type-safe Redux with AppThunk and AppDispatch types
  - Consistent type imports

### Changed

- N/A (Initial release)

### Deprecated

- N/A (Initial release)

### Removed

- N/A (Initial release)

### Fixed

- N/A (Initial release)

### Security

- **Password Security**
  - bcryptjs 3.0.2 for password hashing with salt rounds
  - No plain text password storage
  - Secure password reset flow

- **Authentication**
  - JWT-based session management with NextAuth.js
  - HTTP-only cookies for session tokens
  - CSRF protection enabled
  - Session expiration handling

- **Data Validation**
  - Input sanitization on all API routes
  - Yup schema validation for all forms
  - MongoDB injection prevention via Mongoose
  - Type coercion and sanitization

- **Environment Variables**
  - Sensitive data stored in .env.local (not committed)
  - NEXTAUTH_SECRET for JWT signing
  - MongoDB credentials

- **HTTPS**
  - Self-signed SSL certificates for local development
  - HTTPS enforcement in production

## [Unreleased]

### Planned Features

- Email integration for notifications and invitations
- Real-time updates using Socket.IO
- Advanced reporting and analytics
- File upload support for student documents
- SMS notifications
- Batch import improvements
- Multi-tenant support
- Role-based access control (RBAC) for multiple admin levels

---

## Version History

- **1.0.0** (2025-11-11) - Initial production release
  - Complete student onboarding system
  - Full admin dashboard and management interface
  - Comprehensive testing suite
  - Production-ready with Docker support

---

## Contributors

- Valentin Roehle - Lead Developer & Project Architect

---

## License

This project is proprietary software. All rights reserved.
