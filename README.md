# Kairobuy

A modern e-commerce storefront built with **Next.js**. Kairobuy offers a clean shopping experience across fashion, footwear, home essentials, and accessories, with category browsing, price filters, a wishlist, and a shopping bag.

**Live site:** [kairobuy.com](https://kairobuy.com)

---

## Features

- **Department browsing:** Men, Women, Kids, Home, Accessories, All Products, and New Drops
- **Price filters:** Under ₹1,000, ₹1,000 – ₹3,000, ₹3,000 – ₹5,000, ₹5,000 – ₹10,000, and above ₹10,000
- **Featured offers:** Weekend Sale, New Season, and Premium Picks collections on the home page
- **Shopping bag:** add, remove, and update items
- **Wishlist:** save products for later
- **Location selector:** set your delivery location
- **Order tracking:** check shipment status with an order number
- **Help and legal pages:** Shipping, Returns, Size Guide, Contact, Affiliate Disclosure, Privacy Policy, Terms, and Cookies
- **Responsive design:** works on mobile, tablet, and desktop

## Tech Stack

| Area       | Technology                                  |
| ---------- | ------------------------------------------- |
| Framework  | [Next.js](https://nextjs.org) (App Router)  |
| UI library | [React](https://react.dev)                  |
| Styling    | [Tailwind CSS](https://tailwindcss.com) via PostCSS |
| Database   | [MongoDB Atlas](https://www.mongodb.com/atlas) |
| Image storage | [Vercel Blob](https://vercel.com/docs/vercel-blob) |
| Linting    | ESLint                                      |
| Hosting    | [Hostinger](https://www.hostinger.com)      |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18.18 or later
- npm, yarn, pnpm, or bun

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/shubamKPIT/Kairobuy.git
cd Kairobuy

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open <http://localhost:3000> in your browser.

### Environment Variables

Create a `.env.local` file in the project root (never commit it). Variable names below are typical examples; match them to what your code actually reads.

```
MONGODB_URI=
BLOB_READ_WRITE_TOKEN=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

| Variable                | Description                                  | Required |
| ----------------------- | -------------------------------------------- | -------- |
| `MONGODB_URI`           | MongoDB Atlas connection string              | Yes      |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token for image uploads/storage  | Yes      |
| `NEXT_PUBLIC_SITE_URL`  | Public URL of the site                       | Yes      |

> Tip: commit a `.env.example` file with empty values so others know what to set.

## Available Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the development server         |
| `npm run build` | Create an optimized production build |
| `npm run start` | Run the production build             |
| `npm run lint`  | Check code with ESLint               |

The `scripts/` folder contains helper scripts for maintenance tasks.

## Project Structure

```
Kairobuy/
├── public/             # Static assets (images, logos)
├── scripts/            # Utility / maintenance scripts
├── src/                # Application source (pages, components, helpers)
├── eslint.config.mjs   # ESLint configuration
├── jsconfig.json       # Path aliases
├── next.config.mjs     # Next.js configuration
├── postcss.config.mjs  # PostCSS / Tailwind configuration
└── package.json
```

## Deployment

Kairobuy is hosted on [Hostinger](https://www.hostinger.com) at [kairobuy.com](https://kairobuy.com).

1. Push your code to GitHub.
2. In Hostinger's hPanel, create or open the Node.js web app for the domain and connect this GitHub repository (or upload the project files).
3. Set the Node.js version (18.18 or later) and add your environment variables (`MONGODB_URI`, `BLOB_READ_WRITE_TOKEN`, etc.) in the app settings.
4. Use these commands:
   - Install: `npm install`
   - Build: `npm run build`
   - Start: `npm run start`
5. Redeploy after each push to `main` to publish the latest changes.

> Make sure your MongoDB instance allows connections from your Hostinger server's IP (for MongoDB Atlas, add it under Network Access).
>
> The exact menu names in hPanel depend on your Hostinger plan (shared/Cloud Node.js hosting or VPS), so adjust these steps to match your setup.

## Roadmap

- [ ] Product search with suggestions
- [ ] Per-page SEO metadata, sitemap, and Product structured data
- [ ] Secure order tracking (order number plus email or phone)
- [ ] Payment gateway integration
- [ ] User accounts and order history
- [ ] Automated tests

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## Author

**Rahul Gulati** — [@gulatirahul569](https://github.com/gulatirahul569)

---

*Product images and brand assets are for demonstration purposes. Make sure you have the rights to any images used in production.*