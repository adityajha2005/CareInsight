# CareInsight

An AI-powered healthcare assistant that helps users manage prescriptions and access medical information.

## Key Features

- 🤖 AI-Powered Medical Analysis
- 💊 Prescription Management
- 📊 Health Insights Dashboard
- 🔔 Smart Medication Reminders
- 📱 Push Notifications
- 🔒 Secure Authentication with Clerk
- 🔄 Real-time Updates
- 📱 Responsive Design

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Authentication**: 
  - Clerk (User Auth)
  - Firebase Auth (Push Notifications)
- **Backend & ML**:
  - Python 3.10+
  - FastAPI
  - scikit-learn
  - pandas
  - NumPy
- **Database & Storage**:
  - Firebase Realtime Database
  - Firebase Cloud Storage
  - Firebase Cloud Messaging (FCM)
- **AI Services**: 
  - Cohere
  - OpenAI
  - Anthropic
- **Styling**: Tailwind CSS
- **Deployment**: 
  - Render (Frontend)
  - Railway (Python API)

## Features in Detail

### Medication Reminders
- Schedule medication reminders
- Push notifications via Firebase Cloud Messaging
- Customizable reminder frequency
- Medication adherence tracking
- Multi-device synchronization

### Real-time Features
- Live prescription updates
- Instant medication alerts
- Real-time adherence tracking
- Synchronized across devices

### ML & Analytics
- Custom Python-based symptom analysis
- Medical text processing with NLP
- Health data analytics
- Prescription pattern recognition
- Risk factor assessment

## Getting Started

### Prerequisites

- Node.js 18 or later
- Python 3.10 or later
- pnpm (recommended) or npm
- pip (Python package manager)

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

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_VAPID_KEY=

# Firebase Admin SDK (for notifications)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
FIREBASE_VAPID_PRIVATE_KEY=

# AI Services
COHERE_API_KEY=
NEXT_PUBLIC_OPEN_ROUTER_GROK_API=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# External APIs
NEXT_PUBLIC_NEWS_API=
RAPID_API_KEY=
```

4. Set up Python environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

5. Start the development servers
```bash
# Terminal 1: Frontend
pnpm dev

# Terminal 2: Python API
python api/main.py
```

Visit http://localhost:3000 to see your application.
Python API will be running at http://localhost:8000.

## Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

## Project Structure
```
careinsight/
├── src/              # Frontend source
│   └── ...existing frontend structure...
├── api/              # Python backend
│   ├── models/       # ML models
│   ├── routes/       # API endpoints
│   ├── utils/        # Helper functions
│   └── main.py       # API entry point
├── ml/               # Machine learning
│   ├── training/     # Model training
│   └── data/         # Dataset files
└── requirements.txt  # Python dependencies
```

## Support

For support, email 2005akjha@gmail.com or open an issue in the repository.

## License

