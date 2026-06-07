# 🏔 Moxie Adventures — Full Stack Web Application

> Premium trekking, camping, stargazing & spiritual yatra platform built with React + Node.js + MySQL.

---

## 📁 Project Structure

```
moxie-adventures/
├── frontend/          # React + Vite + Tailwind + Framer Motion
├── backend/           # Node.js + Express REST API
└── database/          # MySQL schema + seed data
```

---

## ⚙️ Prerequisites

| Tool         | Version    |
|--------------|------------|
| Node.js      | 18+        |
| MySQL        | 8.0+       |
| npm          | 9+         |

---

## 🗄 Database Setup

1. Open MySQL client (MySQL Workbench, HeidiSQL, or CLI)
2. Run the full schema file:

```sql
source /path/to/moxie-adventures/database/schema.sql
```

Or via CLI:
```bash
mysql -u root -p < database/schema.sql
```

This creates the `moxie_adventures` database with all tables, indexes, constraints and seed data.

**Default admin credentials (after setup):**
- Email: `admin@moxieadventures.com`
- Password: `Admin@123`

---

## 🖥 Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your credentials:
# DB_HOST=localhost
# DB_USER=root
# DB_PASS=yourpassword
# DB_NAME=moxie_adventures
# JWT_SECRET=your_secret_key
# RAZORPAY_KEY_ID=rzp_test_xxx (optional)
# RAZORPAY_KEY_SECRET=xxx (optional)

# Install dependencies
npm install

# Start development server
npm run dev

# Start production
npm start
```

Backend runs on: `http://localhost:5000`

---

## 🌐 Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Frontend runs on: `http://localhost:5173`

---

## 🔑 Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=yourpassword
DB_NAME=moxie_adventures

JWT_SECRET=moxie_super_secret_key_change_this
JWT_EXPIRES_IN=7d
JWT_ADMIN_EXPIRES_IN=1d

RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

---

## 🚀 API Endpoints

### Authentication
| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| POST   | /api/auth/register    | User registration   |
| POST   | /api/auth/login       | User login          |
| POST   | /api/auth/admin/login | Admin login         |

### Treks
| Method | Endpoint             | Description         |
|--------|----------------------|---------------------|
| GET    | /api/treks           | List all treks      |
| GET    | /api/treks/:slug     | Trek detail         |
| POST   | /api/treks/:id/book  | Book a trek         |
| POST   | /api/treks           | Create trek (admin) |
| PUT    | /api/treks/:id       | Update trek (admin) |

### Events
| Method | Endpoint                  | Description           |
|--------|---------------------------|-----------------------|
| GET    | /api/events               | List all events       |
| GET    | /api/events/:slug         | Event detail          |
| POST   | /api/events/:id/register  | Register for event    |

### Public
| Method | Endpoint            | Description         |
|--------|---------------------|---------------------|
| GET    | /api/gallery        | Gallery images      |
| GET    | /api/reviews        | Approved reviews    |
| GET    | /api/team           | Team members        |
| GET    | /api/careers        | Job openings        |
| GET    | /api/stats          | Site statistics     |
| POST   | /api/contact        | Contact form        |
| POST   | /api/newsletter     | Newsletter signup   |
| POST   | /api/careers/:id/apply | Career application |

### Admin (JWT required)
| Method | Endpoint                  | Description           |
|--------|---------------------------|-----------------------|
| GET    | /api/admin/dashboard      | Dashboard stats       |
| GET    | /api/admin/bookings       | All bookings          |
| PUT    | /api/admin/bookings/:id   | Update booking status |
| GET    | /api/admin/contacts       | Contact messages      |
| PUT    | /api/admin/reviews/:id    | Approve/feature review|
| GET    | /api/admin/subscribers    | Newsletter subscribers|
| GET    | /api/admin/applications   | Career applications   |

### Payment
| Method | Endpoint               | Description         |
|--------|------------------------|---------------------|
| POST   | /api/payment/create-order | Create Razorpay order |
| POST   | /api/payment/verify    | Verify payment      |

---

## 🎨 Pages

| Route              | Page                  |
|--------------------|-----------------------|
| `/`                | Home (Hero, Events, Treks, Community) |
| `/treks`           | All treks with filters |
| `/treks/:slug`     | Trek detail + booking |
| `/camping`         | Camping page          |
| `/stargazing`      | Stargazing + star animation |
| `/events`          | All events (grid/list)|
| `/events/:slug`    | Event detail + register |
| `/gallery`         | Masonry gallery + lightbox |
| `/about`           | About, vision, team   |
| `/contact`         | Contact form + map    |
| `/careers`         | Job listings + apply  |
| `/login`           | User login            |
| `/register`        | User register         |
| `/admin/login`     | Admin login           |
| `/admin/*`         | Admin dashboard       |

---

## 🛠 Admin Dashboard

Access: `http://localhost:5173/admin/login`

Features:
- Dashboard with stats (bookings, revenue, events, subscribers)
- Manage Treks (activate/deactivate, view)
- Manage Events (view all, registration counts)
- Manage Bookings (update status: pending/confirmed/cancelled/completed)
- Manage Gallery (add/remove images with category)
- Moderate Reviews (approve, feature)
- View Contact Messages
- View Newsletter Subscribers
- View Career Applications

---

## 💳 Razorpay Integration

1. Create a Razorpay account at https://razorpay.com
2. Get your test API keys from Dashboard → Settings → API Keys
3. Add to backend `.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
   ```
4. For frontend payment integration, add the Razorpay checkout script to `index.html`:
   ```html
   <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
   ```
5. Use `/api/payment/create-order` to get order ID, then open Razorpay checkout, then verify via `/api/payment/verify`

---

## 🚢 Production Deployment

### Frontend (Vercel / Netlify)
```bash
cd frontend
npm run build
# Upload dist/ folder to Vercel/Netlify
# Set environment variable: VITE_API_URL=https://yourdomain.com
```

Update `vite.config.js` proxy target to production backend URL.

### Backend (Railway / Render / VPS)
```bash
cd backend
# Set all environment variables in platform dashboard
# Set NODE_ENV=production
npm start
```

### MySQL
Use PlanetScale, Railway MySQL, or AWS RDS for managed cloud MySQL.

---

## 🔒 Security Notes

- Change `JWT_SECRET` to a strong random string in production
- Use HTTPS in production
- Set `FRONTEND_URL` to your actual production domain
- Enable MySQL SSL in production
- Rotate Razorpay keys for live mode

---

## 📦 Tech Stack Summary

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React 18, Vite, Tailwind CSS, Framer Motion, React Router v6 |
| Backend     | Node.js, Express.js               |
| Database    | MySQL 8 with mysql2               |
| Auth        | JWT (jsonwebtoken + bcryptjs)     |
| Payments    | Razorpay                          |
| Fonts       | Cormorant Garamond + DM Sans (Google Fonts) |

---

## 🏔 Credits

Built for **Moxie Adventures** — *Explore. Grow. Discover.*

Founder: Krishna Khushwaha | MD: Hiral Sampat
