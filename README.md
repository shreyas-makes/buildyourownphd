# Build Your Own PhD

**Transform any content into your personal PhD curriculum**

*Upload any content → AI processes it → Read/Listen anywhere*

[![GitHub Stars](https://img.shields.io/github/stars/shreyas-makes/buildyourownphd?style=flat&logo=github)](https://github.com/shreyas-makes/buildyourownphd/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/shreyas-makes/buildyourownphd?style=flat&logo=github)](https://github.com/shreyas-makes/buildyourownphd/network/members)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/github/actions/workflow/status/shreyas-makes/buildyourownphd/ci.yml?branch=main&style=flat&logo=github-actions)](https://github.com/shreyas-makes/buildyourownphd/actions)

---

## Overview

**Build Your Own PhD** is an AI-powered platform that transforms educational content into structured, accessible learning experiences. The platform converts PDFs, videos, articles, and audio files into beautiful markdown documentation with AI-generated audio narration, making knowledge consumable across all devices.

**Mission**: Democratize access to knowledge by making any content consumable, searchable, and accessible.

## Key Features

### Content Processing
- **PDF Text Extraction** with formatting preservation
- **Audio/Video Transcription** with timestamp mapping
- **Web Article Processing** with clean formatting
- **AI-Powered Summarization** and organization
- **Multi-format Support** (PDF, MP3, MP4, DOC, etc.)

### Organization & Management
- **Project-Based Management** with hierarchical structure
- **Chapter & Module Organization** with drag-and-drop
- **Automatic Tagging** with smart categorization
- **Advanced Search** with semantic understanding
- **Custom Collections** and learning paths

### Multi-Modal Consumption
- **Beautiful Markdown Rendering** with syntax highlighting
- **High-Quality Text-to-Speech** with multiple voices
- **Mobile-Optimized Reading** with adaptive layouts
- **Advanced Audio Player** with bookmarks & chapters
- **Dark/Light Modes** with accessibility features

### Cross-Platform Sync
- **Responsive Web Application** with PWA support
- **Native Mobile Apps** (iOS/Android) with offline mode
- **Real-Time Synchronization** across all devices
- **Offline Reading & Listening** with smart caching
- **Conflict Resolution** for concurrent edits

## Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Web Frontend** | Next.js 14, TypeScript, TailwindCSS | Responsive web application |
| **Mobile App** | React Native (Expo), TypeScript | Native mobile experience |
| **Backend API** | NestJS, TypeScript, Express | Server and API endpoints |
| **Database** | Supabase (PostgreSQL) | Data storage and real-time sync |
| **Storage** | Supabase Storage | File and media storage |
| **AI Services** | OpenAI GPT-4, Deepinfra Whisper | Content processing |
| **Queue System** | Redis with Bull Queue | Job processing |

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- Git 2.34+

### Installation

```bash
# Clone the repository
git clone https://github.com/shreyas-makes/buildyourownphd.git
cd buildyourownphd

# Install dependencies
npm install

# Copy environment template
cp env.example .env.local
```

### Environment Configuration

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Services
OPENAI_API_KEY=your_openai_api_key
DEEPINFRA_API_KEY=your_deepinfra_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Text-to-Speech (Optional)
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

### Database Setup

```bash
# Initialize database schema
npm run db:setup

# Run migrations
npm run db:migrate

# Seed with sample data (optional)
npm run db:seed
```

### Development

```bash
# Start all services
npm run dev

# Or start individually:
npm run dev:web      # Web app → http://localhost:3000
npm run dev:mobile   # Mobile app → Expo DevTools
npm run dev:backend  # API server → http://localhost:8000
```

## Project Structure

```
buildyourownphd/
├── apps/
│   ├── backend/          # NestJS API server
│   ├── mobile/           # React Native mobile app
│   └── web/              # Next.js web application
├── packages/
│   ├── ui/               # Shared UI components
│   └── utils/            # Shared utilities
├── docs/                 # Documentation
└── scripts/              # Build and deployment scripts
```

## Development Roadmap

### Phase 1: Foundation (Complete)
- [x] Monorepo architecture with Turborepo
- [x] TypeScript throughout the stack
- [x] Supabase authentication & database
- [x] Basic file upload & storage
- [x] Web & mobile app scaffolding
- [x] Testing infrastructure setup

### Phase 2: Core AI Processing (In Progress)
- [x] OpenAI GPT-4 integration
- [x] PDF text extraction pipeline
- [x] Audio transcription services
- [x] Job queue system with Redis
- [ ] Content quality validation
- [ ] Advanced AI summarization
- [ ] Multi-language support
- [ ] Batch processing optimization

### Phase 3: Enhanced User Experience (Q3 2024)
- [ ] Advanced content organization
- [ ] Real-time collaborative editing
- [ ] Advanced audio features
- [ ] Offline-first mobile architecture
- [ ] Advanced search capabilities
- [ ] User analytics and insights
- [ ] Social features and sharing
- [ ] Customizable learning paths

### Phase 4: Platform Expansion (Q4 2024)
- [ ] Browser extension for web clipping
- [ ] Public API for integrations
- [ ] Enterprise features and SSO
- [ ] Advanced analytics dashboard
- [ ] White-label solutions
- [ ] Desktop applications
- [ ] Plugin ecosystem
- [ ] AI-powered recommendations

## Contributing

We welcome contributions from the community. Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with tests and documentation
4. Run tests: `npm run test`
5. Commit your changes: `git commit -m 'feat: add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Submit a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow conventional commit format
- Include comprehensive tests
- Update documentation for new features
- Follow ESLint and Prettier configurations

## Testing

```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:unit        # Unit tests
npm run test:integration # Integration tests
npm run test:e2e         # End-to-end tests
npm run test:mobile      # Mobile app tests

# Run tests in watch mode
npm run test:watch
```

## Documentation

- [Getting Started Guide](https://docs.buildyourownphd.com/getting-started)
- [API Reference](https://docs.buildyourownphd.com/api)
- [Mobile Development](https://docs.buildyourownphd.com/mobile)
- [Deployment Guide](https://docs.buildyourownphd.com/deployment)
- [Contributing Guidelines](https://docs.buildyourownphd.com/contributing)
