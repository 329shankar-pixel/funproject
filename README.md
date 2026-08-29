# Laravel Blog Application

A modern Laravel blog application built with Inertia.js, React, and Tailwind CSS.

## Features

- Public blog with articles, categories, topics, and authors
- Admin dashboard with full CRUD operations
- User authentication with Fortify
- Filament admin panel
- Responsive design with Tailwind CSS

## Requirements

- PHP 8.3 or higher
- MySQL 5.7+ or MariaDB 10.3+
- Composer
- Node.js 18+ (for building assets)

## Local Development

```bash
# Clone the repository
git clone <repository-url>
cd laravel-blog

# Install PHP dependencies
composer install

# Install Node dependencies
npm install

# Create environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env file (see Database Configuration below)

# Run migrations
php artisan migrate

# Build frontend assets
npm run build

# Start development server
php artisan serve
```

## cPanel Shared Hosting Deployment

### Step 1: Upload Files

1. **Via File Manager:**
   - Log into cPanel
   - Open File Manager
   - Navigate to `public_html` (or your domain's document root)
   - Upload all project files EXCEPT the `public` folder contents
   - Upload the contents of the `public` folder directly to `public_html`

2. **Via SSH (if available):**
   ```bash
   # Connect to your hosting
   ssh username@yourdomain.com
   
   # Navigate to public_html
   cd public_html
   
   # Clone the repository (or upload files)
   git clone <your-private-repo-url> .
   
   # OR if files are already uploaded, just run:
   composer install --no-dev --optimize-autoloader
   ```

### Step 2: Directory Structure for cPanel

Your `public_html` should look like this:

```
public_html/
├── .htaccess          (from public/ folder)
├── index.php          (from public/ folder)
├── favicon.ico
├── favicon.svg
├── robots.txt
├── build/             (compiled assets)
├── css/
├── js/
├── app/               (Laravel application - one level up)
├── bootstrap/
├── config/
├── database/
├── public/            (original public folder - can be removed)
├── resources/
├── routes/
├── storage/
├── vendor/
└── ...
```

**IMPORTANT:** The `index.php` file needs to be modified for this structure.

### Step 3: Modify index.php

Edit `public/index.php` to reflect the new directory structure:

```php
<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../bootstrap/cache/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
(require_once __DIR__.'/../bootstrap/app.php')
    ->handleRequest(Request::capture());
```

Change `__DIR__.'/../vendor/autoload.php'` to point to the correct vendor directory based on your structure.

### Step 4: Configure Environment Variables

1. Create or edit `.env` file in your project root (one level above public_html if following the structure above)

2. **Database Configuration:**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_DATABASE=your_database_name
   DB_USERNAME=your_database_username
   DB_PASSWORD=your_database_password
   ```

3. **Application Configuration:**
   ```env
   APP_NAME="Your Blog Name"
   APP_ENV=production
   APP_KEY=base64:your-generated-key
   APP_DEBUG=false
   APP_URL=https://yourdomain.com
   
   LOG_CHANNEL=stack
   LOG_LEVEL=error
   
   SESSION_DRIVER=database
   CACHE_STORE=database
   QUEUE_CONNECTION=database
   ```

4. **Generate Application Key:**
   ```bash
   php artisan key:generate
   ```

### Step 5: Set Directory Permissions

Via File Manager or SSH, set these permissions:

```bash
# Storage directory
chmod -R 775 storage/
chmod -R 775 bootstrap/cache/

# If permissions don't work, try:
chmod -R 777 storage/
chmod -R 777 bootstrap/cache/
```

### Step 6: Run Migrations

Via SSH or cPanel Terminal:

```bash
php artisan migrate --force
```

### Step 7: Optimize for Production

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

### Step 8: Build Frontend Assets

If you have SSH access:

```bash
npm install
npm run build
```

If not, build locally and upload the `public/build` folder.

## Database Configuration

### MySQL Setup in cPanel

1. Go to **MySQL Databases** in cPanel
2. Create a new database
3. Create a new user and add to the database with **ALL PRIVILEGES**
4. Update `.env` with the database credentials

## Common Issues

### 500 Internal Server Error
- Check `.env` file exists and has correct `APP_KEY`
- Verify directory permissions for `storage/` and `bootstrap/cache/`
- Check error logs in cPanel → Error Logs

### Assets Not Loading
- Ensure `public/build` directory exists with compiled assets
- Run `npm run build` locally and upload the build folder
- Check `APP_URL` in `.env` matches your domain

### Routes Not Working
- Verify `.htaccess` is in the public directory
- Ensure `mod_rewrite` is enabled on your server
- Check that `public/index.php` has correct paths

## GitHub Deployment

### Push to GitHub

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add remote (private repository)
git remote add origin git@github.com:yourusername/your-repo.git

# Push
git push -u origin main
```

### Deploy from GitHub to cPanel

Option 1: **Git Version Control (cPanel)**
- Use cPanel's built-in Git Version Control
- Connect to your private repository
- Set deployment path

Option 2: **Manual Deploy**
- Clone repository on server
- Run `composer install --no-dev`
- Build assets
- Configure `.env`

## License

MIT License
