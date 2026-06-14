# OpalStore - Digital Products & AI Subscription Store

A modern, beautiful e-commerce platform for selling digital products, AI tools, templates, and subscription plans. Built with Next.js 14, TypeScript, Tailwind CSS, and designed for the Opal Agent ecosystem.

## 🚀 Features

### Public Features
- **Homepage** - Hero section, featured products, subscription preview, benefits, FAQ
- **Product Catalog** - Browse, search, filter, and sort digital products
- **Product Details** - Detailed product pages with features, FAQ, and purchase options
- **Subscription Plans** - Three-tier subscription system (Basic, Pro, Business)
- **Authentication** - Login and registration with email/password
- **Responsive Design** - Mobile-first design that works on all devices

### User Features
- **User Dashboard** - View purchased products, orders, and subscriptions
- **Order Management** - Track order status and payment confirmation
- **Product Access** - Direct access links to purchased digital products
- **Subscription Management** - View active subscriptions and renewal options

### Admin Features
- **Admin Dashboard** - Overview of revenue, orders, users, and subscriptions
- **Order Management** - Confirm payments and update order status
- **Product Management** - View all products (CRUD coming in future updates)
- **User Management** - View all registered users

## 🎨 Design

- **Dark Theme** - Modern dark UI with navy/slate background
- **Accent Colors** - Electric blue/cyan gradients for CTAs
- **Typography** - Inter font family for clean, modern look
- **Components** - Reusable card-based design with subtle glows and borders

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **Authentication:** Mock auth system (ready for Supabase integration)
- **Data:** Mock data (ready for Supabase PostgreSQL)

## 📦 Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd opalstore
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:3000
```

## 🔐 Demo Accounts

### User Account
- **Email:** john@example.com
- **Password:** demo123

### Admin Account
- **Email:** admin@opalstore.com
- **Password:** demo123

## 📁 Project Structure

```
opalstore/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   ├── products/          # Product pages
│   │   ├── subscription/      # Subscription page
│   │   ├── login/             # Login page
│   │   ├── register/          # Register page
│   │   ├── checkout/          # Checkout page
│   │   ├── dashboard/         # User dashboard
│   │   └── admin/             # Admin dashboard
│   ├── components/            # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ProductCard.tsx
│   ├── lib/                   # Utilities and data
│   │   ├── types.ts           # TypeScript types
│   │   ├── utils.ts           # Utility functions
│   │   ├── data.ts            # Mock data
│   │   └── auth-context.tsx  # Auth context
│   └── app/globals.css        # Global styles
├── public/                    # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## 🎯 Key Pages

1. **Homepage (/)** - Landing page with hero, products, subscriptions
2. **Products (/products)** - Product catalog with filters
3. **Product Detail (/products/[slug])** - Individual product page
4. **Subscription (/subscription)** - Subscription plans comparison
5. **Checkout (/checkout)** - Order checkout form
6. **Login (/login)** - User login
7. **Register (/register)** - New user registration
8. **Dashboard (/dashboard)** - User dashboard
9. **Admin (/admin)** - Admin panel (requires admin role)

## 💳 Payment Methods (MVP)

Current MVP supports manual payment methods:
- Bank Transfer
- QRIS
- WhatsApp Order Confirmation

Payment gateway integration (Midtrans, Xendit, etc.) can be added in future updates.

## 🔄 Database Schema (Ready for Supabase)

The project includes complete TypeScript types for:
- Users
- Products
- Categories
- Orders
- Subscriptions
- Access (product access management)

See `src/lib/types.ts` for full schema.

## 🚧 Future Enhancements

### Phase 2 - Automation
- [ ] Integrate Supabase for database
- [ ] Payment gateway integration (Midtrans/Xendit)
- [ ] Automatic product delivery
- [ ] Email/WhatsApp notifications
- [ ] Invoice generation
- [ ] Coupon codes system

### Phase 3 - Growth
- [ ] Affiliate/referral system
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Product bundles
- [ ] Membership levels
- [ ] Analytics dashboard
- [ ] Personalized recommendations

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to change theme colors:
```typescript
colors: {
  primary: '#3B82F6',    // Electric blue
  accent: '#8B5CF6',     // Purple
  success: '#10B981',    // Green
  // ... more colors
}
```

### Content
Update mock data in `src/lib/data.ts` to change:
- Products
- Categories
- Subscription plans
- FAQ items

### WhatsApp Link
Change WhatsApp number in `src/lib/utils.ts`:
```typescript
export const WHATSAPP_NUMBER = '6281234567890'; // Your number
```

## 📱 Responsive Design

- **Mobile:** 320px - 767px
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px+

All pages are fully responsive and tested on multiple devices.

## 🐛 Known Issues / Limitations

1. **Authentication:** Currently using mock auth. Needs Supabase integration for production.
2. **Payment:** Manual payment confirmation. Needs payment gateway for automation.
3. **File Storage:** Product files use placeholder URLs. Need cloud storage integration.
4. **Email:** No email notifications yet. Needs email service integration.

## 📝 License

This project was created for Opal Agent / OpalStore.

## 🤝 Support

For support, contact us via:
- WhatsApp: [Link in footer]
- Email: support@opalagent.my.id

---

**Built with ❤️ for the Opal Agent ecosystem**
