# CareInsight

Empowering healthcare decisions with AI technology and making medical information accessible to everyone.

## Key Features

- AI-Powered Disease Catalogue with 1000+ diseases
- 24/7 AI Assistance
- Prescription Analysis and Management
- User-friendly Medical Information Access
- Privacy-Focused Data Handling

## Tech Stack

### Frontend
- React 18.2
- Tailwind CSS 3.3
- Framer Motion 10.x
- Phosphor Icons
- TypeScript 5.0

### Backend
- Node.js 18 LTS
- Express 4.18
- MongoDB 6.0 with Mongoose
- JWT Authentication
- OpenAI API integration

### DevOps & Tools
- Git
- ESLint
- Render for deployment

## Getting Started

### Prerequisites

- Node.js v16 or higher
- MongoDB v4.4 or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/adityajha2005/careinsight.git
cd careinsight
```

2. Install dependencies (npm or pnpm)
```bash
# Using npm
npm install

# Using pnpm
pnpm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

4. Start the application
```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run test     # Run tests
npm run typecheck # Run TypeScript checks
```

## Project Structure

```
careinsight/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── api/           # API routes
│   ├── lib/          # Utility functions
│   ├── types/        # TypeScript types
│   └── styles/       # CSS styles
├── public/           # Static files
└── tests/           # Test files
```

## Deployment

The application is deployed at: https://careinsight.render.com

### Deployment Configuration
- Main Branch: Automatically deploys to production
- Development Branch: Deploys to staging environment
- Preview Deployments: Available for pull requests

## Configuration

### Required Environment Variables
Create a `.env` file with the following configurations:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Application
PORT=3000
NODE_ENV=development
```

## Core Values

- **User-Centric**: Putting users' needs first in everything we do
- **Privacy-Focused**: Ensuring the security and privacy of your medical data
- **Innovation-Driven**: Continuously improving our AI technology

## API Documentation

API documentation is available at `/api-docs` when running in development mode. We use Swagger UI for API documentation.

### Key API Endpoints
- `/api/auth` - Authentication endpoints
- `/api/catalog` - Disease catalogue access
- `/api/prescriptions` - Prescription analysis
- `/api/user` - User data management

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email 2005akjha@gmail.com or open an issue in the repository.