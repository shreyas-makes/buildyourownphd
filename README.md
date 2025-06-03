# 🎓 Build Your Own PhD

An AI-powered platform for organizing and consuming PhD research materials across multiple formats.

## 🏗️ Monorepo Structure

This is a Turborepo monorepo containing:

- **apps/web** - Next.js web application
- **apps/mobile** - React Native Expo mobile app  
- **apps/backend** - NestJS API server
- **packages/ui** - Shared UI components
- **packages/utils** - Shared utilities and types

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd buildyourownphd

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development servers
npm run dev
```

This will start:
- Web app: http://localhost:3000
- Mobile app: http://localhost:19006 (Expo)
- Backend API: http://localhost:3001

## 📁 Project Structure

```
buildyourownphd/
├── apps/
│   ├── web/          # Next.js web application
│   ├── mobile/       # React Native Expo app
│   └── backend/      # NestJS API server
├── packages/
│   ├── ui/           # Shared React components
│   └── utils/        # Shared utilities and types
├── turbo.json        # Turborepo configuration
└── package.json      # Root package.json
```

## 🛠️ Available Scripts

### Development
```bash
npm run dev          # Start all development servers
npm run dev:web      # Start only web app
npm run dev:mobile   # Start only mobile app  
npm run dev:backend  # Start only backend API
```

### Building
```bash
npm run build        # Build all applications
npm run build:web    # Build web app only
npm run build:mobile # Build mobile app only
npm run build:backend # Build backend only
```

### Testing
```bash
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Linting & Formatting
```bash
npm run lint         # Lint all code
npm run lint:fix     # Fix linting issues
npm run format       # Format all code
npm run type-check   # Run TypeScript checks
```

## 🔧 Environment Setup

1. Copy `.env.example` to `.env.local`
2. Configure your environment variables:
   - Database URL (Supabase)
   - AI service API keys (OpenAI, Deepinfra, Anthropic)
   - Authentication secrets
   - File storage configuration

## 🏢 Architecture

### Backend (NestJS)
- RESTful API with TypeScript
- File upload and processing
- AI service integrations
- Authentication and authorization
- Job queue for async processing

### Web App (Next.js)
- Server-side rendering
- Drag-and-drop file uploads
- Real-time processing updates
- Content organization interface
- Responsive design

### Mobile App (React Native Expo)
- Cross-platform iOS/Android
- Offline-first architecture
- Markdown rendering
- Audio playbook features
- Native performance

### Shared Packages
- **@buildyourownphd/ui**: Reusable React components
- **@buildyourownphd/utils**: Shared utilities, types, error handling

## 🧪 Testing Strategy

- **Unit Tests**: Jest for individual components/functions
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Playwright for complete user workflows
- **Visual Testing**: Screenshot comparison
- **Performance Testing**: Load testing and metrics

## 📦 Package Management

This project uses npm workspaces with Turborepo for:
- Shared dependency management
- Parallel task execution
- Intelligent caching
- Cross-package dependencies

## 🚀 Deployment

The application is designed for deployment on Railway:
- **Backend**: NestJS server
- **Web**: Next.js static export
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **Monitoring**: Built-in observability

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run linting and tests
6. Submit a pull request

## 📚 Documentation

- [API Documentation](./apps/backend/README.md)
- [Web App Guide](./apps/web/README.md)
- [Mobile App Guide](./apps/mobile/README.md)
- [Component Library](./packages/ui/README.md)

## 🛡️ Error Handling

The application includes comprehensive error handling:
- Global error boundaries in React apps
- Structured error responses with codes
- Request ID tracking for debugging
- Graceful degradation for service failures
- Detailed logging at all levels

## 📈 Monitoring

Built-in monitoring includes:
- Performance metrics
- Error tracking and alerting
- User analytics
- Health check endpoints
- Resource usage monitoring

## 📄 License

[Your License Here] 