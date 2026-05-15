# Mường Thanh Luxury Hotel Management

A full-stack hotel booking and management system for the Mường Thanh hotel chain, featuring a customer-facing booking website and a comprehensive internal admin dashboard.

---

## Features

### Customer Website
- Hotel listing with filters by region, brand, and amenities
- Hotel detail page with image gallery, map, and room types
- Multi-step booking flow: select room → add-on services → payment
- User authentication (register / login)
- Customer profile: booking history, cancellation
- Automatic bank transfer confirmation via **SePay webhook**
- Promotional discount codes support
- Bilingual interface: Vietnamese / English

### Admin Dashboard (`/admin`)
| Page | Features |
|---|---|
| Dashboard | Revenue stats, occupancy rate, monthly charts |
| Bookings | View, filter, add manual bookings, update status |
| Customers | Customer list, VIP tier, booking history |
| Hotels | Manage hotel listings and room types |
| Staff | Role-based access (Manager / Receptionist / Housekeeping / ...) |
| Reviews | Approve/reject reviews, reply to comments |
| Promotions | Create discount codes, usage limits, expiry dates |
| Payments | Transaction history, manual payment recording |
| Emails | Block-based email template editor (header, text, button, highlight, footer) with test send |
| Settings | Service fees, add-on services (price, enable/disable) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript (no framework) |
| Backend | PHP 8+ with PDO |
| Database | MySQL |
| Server | Apache (XAMPP) |
| Payment | SePay (automatic bank transfer webhook) |
| Email | PHP Mailer |
| Fonts | Google Fonts — Cormorant Garamond + Inter |

---

## Project Structure

```
booking.mt/
├── index.html          # Hotel listing homepage
├── hotel.html          # Hotel detail page
├── booking.html        # Booking flow
├── search.html         # Advanced search
├── login.html          # Login / register
├── profile.html        # Customer profile
├── style.css           # Global styles
├── i18n.js             # Bilingual module (VI/EN) for public pages
│
├── admin/              # Admin dashboard
│   ├── index.html      # Booking list
│   ├── dashboard.html  # Analytics overview
│   ├── customers.html
│   ├── hotels.html
│   ├── staff.html
│   ├── reviews.html
│   ├── promotions.html
│   ├── payments.html
│   ├── emails.html
│   ├── settings.html
│   ├── admin.css
│   ├── admin-i18n.js   # Bilingual module (VI/EN) for admin pages
│   └── admin-auth.js   # Session guard, language switcher injection
│
├── api/                # REST API (PHP)
│   ├── config.php      # Database connection
│   ├── bookings.php
│   ├── customers.php
│   ├── hotels.php
│   ├── payments.php
│   ├── promotions.php
│   ├── reviews.php
│   ├── staff.php
│   ├── emails.php
│   ├── extras.php
│   ├── settings.php
│   ├── dashboard.php
│   ├── auth.php
│   ├── admin_auth.php
│   ├── mailer.php
│   └── sepay_webhook.php
│
├── data/
│   └── hotels.js       # Static hotel data for frontend rendering
│
├── img/                # Hotel images
└── database.sql        # Database schema + sample data
```

---

## Local Setup

### Requirements
- XAMPP (Apache + MySQL + PHP 8+)

### Steps

**1. Clone the repository into your XAMPP folder**
```bash
git clone https://github.com/baongoc2005/M-ng-Thanh-Luxury-Hotel-Management-.git
# Place it at: /Applications/XAMPP/xamppfiles/htdocs/booking.mt   (macOS)
#              C:\xampp\htdocs\booking.mt                          (Windows)
```

**2. Create the database**

Open phpMyAdmin, create a database named `booking_mt`, then import:
```
database.sql
```

**3. Configure the database connection**

Open `api/config.php` and fill in your credentials:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'booking_mt');
define('DB_USER', 'root');
define('DB_PASS', '');
```

**4. Start XAMPP** and open:
```
http://localhost/booking.mt/           # Customer website
http://localhost/booking.mt/admin/     # Admin dashboard
```

### Default Admin Account
```
Email:    admin@muongthanh.com
Password: admin123
```

---

## SePay Payment Integration

The project uses SePay to automatically confirm bank transfer payments.

1. Create an account at [sepay.vn](https://sepay.vn)
2. Set the webhook URL in your SePay dashboard:
   ```
   https://yourdomain.com/api/sepay_webhook.php
   ```
3. Add your `SEPAY_API_TOKEN` to `api/config.php`

---

## Bilingual Support

All pages support **Vietnamese ↔ English** switching without a full page reload:
- Public pages: `i18n.js`
- Admin pages: `admin/admin-i18n.js`
- Language preference is stored in `localStorage` and applied on every page load

---

## Screenshots

> *(Add screenshots of the homepage, booking flow, and admin dashboard here)*

---

## Author

Developed by **baongoc2005**
