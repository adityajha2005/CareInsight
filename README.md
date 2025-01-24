# CareInsight

An AI-powered healthcare assistant that helps users manage prescriptions and access medical information.

## Key Features

- 🤖 AI-Powered Medical Analysis
- 💊 Prescription Management
- 📊 Health Insights Dashboard
- 🔒 Secure Authentication with Clerk
- 📱 Responsive Design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: Clerk
- **AI Services**: 
  - Cohere
  - OpenAI
  - Anthropic
- **Styling**: Tailwind CSS
- **Deployment**: Render

## Getting Started

### Prerequisites

- Node.js 18 or later
- pnpm (recommended) or npm

### Local Development Setup

1. Clone the repository
```bash
git clone https://github.com/adityajha2005/careinsight.git
cd careinsight
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Required environment variables:

```env
# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# AI Services
COHERE_API_KEY=
NEXT_PUBLIC_OPEN_ROUTER_GROK_API=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# External APIs
NEXT_PUBLIC_NEWS_API=
RAPID_API_KEY=

# Firebase (if using Firebase features)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
```

4. Start the development server
```bash
pnpm dev
```

Visit http://localhost:3000 to see your application.

## Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

## Project Structure
```
src/
├── app/                # App router pages
├── components/         # Reusable components
├── lib/               # Utility functions
└── types/             # TypeScript types
```

## Support

For support, email 2005akjha@gmail.com or open an issue in the repository.

## License

