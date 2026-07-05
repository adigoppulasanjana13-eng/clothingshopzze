# BLUSH & BLOOM | ShopEZ

A full-stack fashion e-commerce platform with generational product collections, cart, checkout, coupons, and order tracking — built end-to-end and deployed to production.

## The Problem

Most student e-commerce projects stop at a product listing page. Real e-commerce needs a working cart, checkout, order history, stock management, and an admin side — the parts that actually make a store functional, not just a catalog demo.

## The Solution

BLUSH & BLOOM is a complete shopping flow: browse by generational collection (Little Blooms to Timeless Grace), add to cart, apply coupons, check out with COD or sandbox online payment, and track order status from a personal dashboard. An admin role manages the catalog and stock separately from customer accounts.

## Live Demo

👉 [shopez-lovat.vercel.app](https://shopez-lovat.vercel.app)

## Screenshots

<table>
<tr>
<td align="center"><b>Landing Page</b><br><img width="400" height="400" alt="landing page" src="https://github.com/user-attachments/assets/89defe23-b419-485e-a279-c6f4b7bb484b" />
</td>
<td align="center"><b>Checkout</b><br><img width="400" height="400" alt="checkout" src="https://github.com/user-attachments/assets/7ea99418-d56a-46ea-bedf-1436d98808f4" />
</td>
</tr>
</table>

## Key Features

- **Generational collections** — products filtered by age group, from Little Blooms (0-6) to Timeless Grace (50+)
- **Cart & checkout** — quantity/size selection, address entry, COD or sandbox card/UPI payment
- **Coupons** — promo code logic (percentage and flat-amount discounts)
- **Order management** — stock deducts on purchase; customers track status (Placed → Processing → Shipped → Delivered)
- **Role-based access** — separate admin and customer permissions
- **Serverless-safe database handling** — lazy MongoDB connection inside API middleware to avoid cold-start/connection exhaustion issues on Vercel

## Tech Stack

**Frontend:** HTML5, CSS3, Vanilla JavaScript
**Backend:** Node.js, Express.js
**Database:** MongoDB (Mongoose)
**Deployment:** Vercel (serverless functions)

## Run It Locally

```bash
git clone https://github.com/adigoppulasanjana13-eng/shopez-ecommerce.git
cd shopez-ecommerce
npm install
cd backend && npm install && cd ..
```

Create `backend/.env`:
```env
PORT=3000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_signature_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Seed sample data (30 products, coupons):
```bash
MONGO_URI="your_connection_string" node backend/seed.js
```

Start the server:
```bash
node backend/server.js
```
Open `http://localhost:3000`.

## Deployment

Deployed on Vercel using the root `vercel.json` and a serverless entrypoint at `api/index.js` that routes backend logic dynamically.

```bash
npx vercel --prod --yes
```
