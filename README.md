<div align="center">
  <br />

  # 🎓 SkillBridge
  ### A High-Performance Tutor Booking Ecosystem built with Next.js 15

  <p align="center">
    <a href="https://skill-bridge-frontend-gamma.vercel.app" target="_blank"><strong>Live Demo</strong></a> ·
    <a href="https://github.com/habiburRhaman05/skill-bridge-backend" target="_blank"><strong>Backend Repo</strong></a> ·
    <a href="https://drive.google.com/file/d/18Yg5uUSScCjlSJJbN5UglHGvT7puB8Jz/view?usp=drivesdk" target="_blank"><strong>Demo Video</strong></a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" />
    <img src="https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript" />
    <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwindcss" />
    <img src="https://img.shields.io/badge/shadcn/ui-Accessible-black?style=for-the-badge" />
    <img src="https://img.shields.io/badge/Framer_Motion-611AD1?style=for-the-badge&logo=framer" />
  </p>
</div>

---

## 📌 Project Overview



**SkillBridge** is a comprehensive educational marketplace designed to bridge the gap between expert tutors and eager learners. This project implements a complex **Multi-Role RBAC (Role-Based Access Control)** system, handling distinct workflows for Students, Tutors, and Administrators within a unified, high-performance interface.

### 🎯 Engineering Focus
- **Architecture:** Leveraging Next.js 15 App Router with Route Groups for clean separation of role-based layouts.
- **Security:** Strict Middleware-based route protection and HTTP-only cookie session management.
- **Performance:** Optimized Core Web Vitals via Next.js Image optimization and server-side pre-fetching.
- **UX:** Fluid micro-interactions and smooth inertia scrolling for a premium feel.

---

## ✨ Advanced Features

### 👨‍🎓 Student Journey
- **Smart Discovery:** Multi-parameter filtering (subject, price range, and ratings) with real-time updates.
- **Seamless Booking:** Interactive scheduling interface that syncs with tutor availability.
- **Personal Dashboard:** Comprehensive view of upcoming sessions, payment history, and saved tutors.

### 👩‍🏫 Tutor Management
- **Availability Engine:** Custom logic for tutors to manage time slots and recurring availability.
- **Analytics Dashboard:** Visual representation of earnings and student engagement using **Recharts**.
- **Bio Builder:** Specialized forms to showcase expertise, certifications, and pricing.

### 🛡️ Admin Governance
- **Operational Oversight:** High-level metrics showing platform growth and user activity.
- **Moderation Tools:** Ability to manage user roles, verify tutors, and moderate content/reviews.
- **System Config:** Dynamic management of tutoring categories and platform-wide tags.

---

## 🧠 Frontend Engineering Highlights



- **Data Fetching:** Hybrid strategy using **Server Components** for SEO/Initial load and **TanStack Query** for client-side state/caching.
- **Mutations:** Using **Next.js Server Actions** for secure, server-side data updates with optimistic UI feedback.
- **Type Safety:** End-to-end type safety using **TypeScript** and **Zod** schema validation for all API interactions and forms.
- **Animations:** A sophisticated mix of **GSAP** for complex timelines and **Framer Motion** for state-driven UI transitions.

---

## 🧱 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **State/Data** | TanStack Query (React Query) |
| **Styling** | Tailwind CSS v4 |
| **Components** | shadcn/ui (Radix UI) |
| **Form Logic** | React Hook Form + Zod |
| **Motion** | Framer Motion, GSAP, Lenis |
| **Charts** | Recharts |

---

## 📁 Folder Structure

```
src/
├── actions/         # Next.js Server Actions for data mutations
├── app/             # Route Groups (auth), (dashboard), (public)
├── components/      # Atomic UI (atoms, molecules, organisms)
├── config/          # Global site metadata and constants
├── hooks/           # Custom React hooks (useAuth, useLocalStorage)
├── lib/             # Third-party library configs (Axios, Prisma, utils)
├── providers/       # Context Providers (QueryClient, Theme, Auth)
├── services/        # API abstraction layer / Service layer
├── types/           # Global TypeScript interfaces and enums
└── middleware.ts    # Route protection & session handling
```
## ⚙️ Configuration & Setup

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=https://skill-bridge-backend-production-7e35.up.railway.app
```

# Run Locally
```

# Clone repository
git clone https://github.com/habiburRhaman05/skill-bridge-frontend

# Navigate to project
cd skill-bridge-frontend

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

# 🔐 Credentials for Testing

 Use the following accounts to test Role-Based Access Control (RBAC):

 | Role  | Email                                         | Password   |
| ----- | --------------------------------------------- | ---------- |
| Admin | [admin@skillbridge.com](mailto:admin@skillbridge.com) | password123 |

