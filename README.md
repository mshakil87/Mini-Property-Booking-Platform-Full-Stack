# LivedIn Project

## Overview
- API: Laravel (`apps/api`)
- Frontend: React + Vite + Tailwind (`apps/frontend`)
- Admin Panel: React + Vite + Tailwind (`apps/admin-panel`)

## Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- npm
- MySQL or SQLite configured in `.env`

## Setup
1. Copy environment file for API:
   - `cd apps/api`
   - `cp .env.example .env` and set database credentials
   - `composer install`
   - `php artisan key:generate`
2. Run migrations and seeders:
   - `php artisan migrate`
   - `php artisan db:seed`
   - `php artisan storage:link`
3. Install frontend/admin dependencies:
   - `cd ../frontend && npm install`
   - `cd ../admin-panel && npm install`

## Development
- API:
  - `cd apps/api`
  - `php artisan serve`
  - Base URL: `http://localhost:8000`
- Frontend:
  - `cd apps/frontend`
  - `npm run dev`
  - Base URL: `http://localhost:5173`
- Admin Panel:
  - `cd apps/admin-panel`
  - `npm run dev`
  - Base URL: `http://localhost:5174`

## Production Build
- Frontend: `cd apps/frontend && npm run build`
- Admin Panel: `cd apps/admin-panel && npm run build`

## Authentication
- Admin: `admin@example.com` / `password`
- Guest: `guest@example.com` / `password`
- API endpoints use Laravel Sanctum tokens.

## Features
- Properties with amenities, images, and media gallery
- Availability ranges and booking flow
- Admin CRUD for properties, media upload, booking moderation
- Separate Add/Edit Property pages in Admin Panel
- "Add Property" button on Admin Property listing
- Search and filter functionality for Admin Properties (by title/location) and Bookings (by property title/user email and status)
- Pagination on listings and bookings
- Redesigned Admin Panel Login Page with improved styling and redirection on successful login.
- Enhanced error handling for property updates in the Admin Panel.
- Image slider/gallery with auto-start and full-size image pop-up functionality on frontend property details page.

## Troubleshooting
- **Direct URL Access (404 errors in development/preview):** If you encounter 404 errors when directly accessing routes (e.g., `/properties`, `/bookings`) in the frontend or admin panel development/preview environments, ensure `historyApiFallback: true` is configured in `vite.config.ts` for the `preview` server. This allows client-side routing to handle non-static asset requests.

## Media
- Admin can upload images/videos stored under `storage/app/public/property-media/<propertyId>/...`
- Seeded properties include image URLs from `https://dummyimage.com/`

## Notes
- If booking is attempted without login, frontend redirects to login, then back to the target page.
- Storage link must exist for media to render: `php artisan storage:link`
