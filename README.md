# ADCET Training & Placement Portal

> Official Training and Placement Portal for **Annasaheb Dange College of Engineering & Technology, Ashta**.  
> Built and maintained by [The Tech Tentacles](https://github.com/The-Tech-Tentacles).

---

## Overview

The ADCET TPP (Training & Placement Portal) is a full-stack web application that centralises all placement-related activities for students, faculty, and the TPO office. It replaces manual, paper-based workflows with a fast, role-based digital platform.

**Key roles supported:**
- **Student** — View drives, manage profile, track applications
- **TPO (Admin)** — Post drives, manage students, oversee analytics
- **Recruiter** *(planned)* — Review candidates, schedule interviews

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) + Radix UI |
| State / Data Fetching | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Theme | next-themes (light / dark / system) |
| Runtime | Bun |

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) `>= 1.3`
- Node.js `>= 20` (for tooling compatibility)

### Installation

```bash
# Clone the repository
git clone https://github.com/The-Tech-Tentacles/TPO.git
cd TPO

# Install dependencies
bun install
```

### Development

```bash
bun run dev
```

The app will be available at `http://localhost:3000`.

### Build

```bash
bun run build
bun run start
```

### Lint & Format

```bash
bun run lint
bun run format
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & layouts
│   ├── (auth)/             # Login & register routes
│   ├── (student)/          # Student-facing pages
│   └── (tpo)/              # TPO admin pages
├── components/             # Shared UI components
├── features/               # Feature-scoped components & logic
│   ├── auth/
│   ├── student/
│   └── tpo/
├── shared/                 # Global providers, config, utilities
└── styles.css              # Global styles & design tokens
```

---

## Environment Variables

Create a `.env.local` file in the project root. Required variables will be documented here as backend integration progresses.

```env
# Example
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

---

## License

This project is proprietary software. **All rights reserved.**  
See [`LICENSE`](./LICENSE) for full terms. Unauthorised use, copying, or distribution is strictly prohibited.

---

## Developed by

**The Tech Tentacles**  
[github.com/The-Tech-Tentacles](https://github.com/The-Tech-Tentacles)
