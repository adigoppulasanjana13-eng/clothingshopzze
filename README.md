# BLUSH & BLOOM | Editorial Fashion E-Store

BLUSH & BLOOM (Shopez) is a premium, multi-generational editorial clothing e-commerce web application. The platform offers curated sustainable fashion crafted from premium organic fabrics (e.g., flax linen, Kashmiri pashmina, organic cotton) customized for various generational age groups. 

Built using the MERN stack and optimized for serverless hosting on Vercel, it features a complete shopping flow from product discovery to checkout.
---

## 🛠️ Technology Stack
- **Frontend**: Vanilla HTML5, CSS3 (Premium typography, animations, responsive design), Vanilla JavaScript.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Deployment**: Vercel Serverless Functions.

---

## ✨ Key Features
- **Generational Collections**: Dynamically filter products by age groups (Little Blooms 0-6Y, Tween Style 7-12Y, Teen Edit 13-17Y, Young Women 18-25Y, Modern & Professional 26-35Y, Elegant Sophistication 36-50Y, Timeless Grace 50Y+).
- **Shopping Cart & Checkout**: Add/remove products, adjust quantities, select sizes, configure shipping address, and choose a payment mode (COD or Sandbox Online Card/UPI).
- **Discount Coupons**: Apply promotional code rules (e.g. `WELCOME10` for 10% off, `BLOOM20` for 20% off, `FESTIVE300` for flat ₹300 off).
- **Secure Order Management**: Order placements deduct product stock dynamically and validation logic ensures items and images sync safely with database constraints.
- **Personalized Profile Dashboard**: View order history, track order statuses (Placed, Processing, Shipped, Delivered), and manage saved shipping addresses.
- **Role-Based Access Control**: Separate admin permissions and client accounts.
- **Serverless Database Stability**: Uses lazy connection handling inside the API middleware to prevent serverless database exhaustion and cold start timeouts.

---

## 🗄️ Database Seeding
The application is pre-seeded with sample data to showcase the editorial catalog. The seed script populates:
- **Admin account**: `admin@blushandbloom.com` / `adminpassword123`
- **Default user account**: `sathwika@example.com` / `userpassword123`
- **Coupons**: `WELCOME10`, `BLOOM20`, `FESTIVE300`
- **30 Premium Products**: With descriptions, fabrics, sizes, stock, price details, and featured reviews.

To manually seed the database (local or remote):
```bash
MONGO_URI="your_mongodb_connection_string" node backend/seed.js
```

---

## ⚙️ Environment Variables
Create a `.env` file in the `backend/` directory or add these to your Vercel project environment variables settings:
```env
PORT=3000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_signature_secret
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

---

## 💻 Local Development Setup
1. **Clone the repository** and navigate to the project directory.
2. **Install Root dependencies**:
   ```bash
   npm install
   ```
3. **Install Backend dependencies**:
   ```bash
   cd backend && npm install && cd ..
   ```
4. **Configure your local Environment Variables** in `backend/.env`.
5. **Start local server**:
   ```bash
   node backend/server.js
   ```
   Open your browser to `http://localhost:3000` to interact with the application.

---

## 📦 Deployment on Vercel
Deploying to Vercel is streamlined with the root `vercel.json` and the serverless entrypoint `api/index.js` which routes all backend logic dynamically.

Deploy commands:
```bash
# Preview deployment
npx vercel --yes

# Production deployment
npx vercel --prod --yes
```
