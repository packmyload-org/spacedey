# Spacedey

Spacedey is a modern web application for finding and booking storage solutions in Nigeria. It connects users with storage locations, provides detailed unit sizing information, and offers related packing products.

## Features

- **Location Search**: Interactive map-based search to find storage units across Nigerian cities (Lagos, Abuja, etc.).
- **Unit Sizing**: Detailed guides and visuals to help users choose the right storage unit size.
- **Booking**: Streamlined reservation process.
- **Products**: integrated store for moving and packing supplies.
- **Referral Program**: System for user referrals and rewards.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Maps**: Google Maps API
- **Icons**: Lucide React
- **Customer Support**: Zendesk Integration

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd spacedey
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Copy `.env.local.example` to `.env.local` (if available) or ensure you have the necessary API keys (Google Maps, Zendesk, etc.).

4. Run the development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- `npm run dev`: Runs the development server with Turbopack.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production build.
- `npm run lint`: Runs ESLint for code quality.

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components (Hero sections, Nav, Modals).
- `lib/`: Utility functions and shared logic.
- `public/`: Static assets (images, fonts).