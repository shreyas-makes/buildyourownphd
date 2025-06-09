<div align="center">

# Build Your Own PhD


### 🎓 Self-Directed Learning for the Intellectually Curious

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Ruby Version](https://img.shields.io/badge/ruby-3.2.2+-red.svg)](https://www.ruby-lang.org/en/)
[![Rails Version](https://img.shields.io/badge/rails-8.0+-red.svg)](https://rubyonrails.org/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![OpenAI Powered](https://img.shields.io/badge/AI-OpenAI%20Powered-blue.svg)](https://openai.com/)

---

**An open-source platform for lifelong learners who want to create their own self-directed, mastery-focused learning paths.**

Transform any topic into your personalized "PhD" with AI-powered content processing, gamified learning, and spaced repetition.

[🚀 Getting Started](#getting-started-build-it-yourself-byok) • [📚 Features](#features) • [🤝 Contributing](#contributing) • [📖 Documentation](#)

</div>

This platform provides the tools to curate content, process it with AI, engage with it through text-to-speech and active recall, and track your progress—turning the internet into your university.

Traditional education can be rigid and expensive. A "self-learned PhD" isn't about a formal title; it's about the pursuit of deep knowledge and mastery on your own terms. It's for the intellectually curious, the career-changers, and anyone who believes in the power of self-driven education. This project gives you the tools to structure that journey.

## ✨ Features

<div align="center">

| 🎯 **Smart Learning** | 🎧 **Audio Experience** | 🎮 **Gamification** |
|:---:|:---:|:---:|
| AI-powered content chunking | Text-to-speech conversion | XP points & achievements |
| Personalized curriculum | Podcast-style learning | Learning streaks |
| Intelligent processing | ElevenLabs integration | Progress tracking |

</div>

### 🔧 Core Capabilities

- **📚 Content Curation**: Add articles, papers, and resources via URL or text to build your custom curriculum
- **🤖 AI-Powered Processing**: Content automatically chunked into digestible, focused learning sessions *(OpenAI)*
- **🎧 Text-to-Speech**: Listen to your content, turning articles into your personal podcast *(ElevenLabs)*
- **🎮 Gamified Learning**: Stay motivated with experience points (XP), learning streaks, and achievements
- **🧠 Spaced Repetition**: Integrated quizzes and review schedules for long-term retention *(Coming Soon)*
- **⚡ Admin Dashboard**: Manage users and content through a built-in Active Admin panel
- **🔐 Secure Authentication**: User accounts powered by Devise

## 🛠️ Tech Stack

<div align="center">

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

</div>

Built with modern web technologies using the [Speedrail](https://github.com/ryanckulp/speedrail) template for rapid development and excellent user experience.

| Layer | Technologies |
|-------|-------------|
| **🔧 Backend** | Ruby on Rails 8, PostgreSQL, Delayed Job |
| **🎨 Frontend** | Hotwire (Turbo + Stimulus), Tailwind CSS, Flowbite |
| **🤖 AI & APIs** | OpenAI, ElevenLabs, Stripe |

## 🚀 Getting Started: Build It Yourself (BYOK)

<div align="center">

![BYOK](https://img.shields.io/badge/BYOK-Bring%20Your%20Own%20Keys-orange?style=for-the-badge)
![Self Hosted](https://img.shields.io/badge/Self%20Hosted-100%25%20Control-green?style=for-the-badge)

</div>

This project follows a **"Bring Your Own Keys" (BYOK)** model. You'll host it on your own system and provide your own API keys for the integrated services—giving you complete control over your data and costs.

### 📋 Prerequisites

Make sure you have the following installed:

- ![Ruby](https://img.shields.io/badge/Ruby-3.2.2+-CC342D?style=flat&logo=ruby&logoColor=white) Ruby 3.2.2+
- ![Rails](https://img.shields.io/badge/Rails-8.0+-CC0000?style=flat&logo=ruby-on-rails&logoColor=white) Rails 8+  
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-316192?style=flat&logo=postgresql&logoColor=white) PostgreSQL
- ![Node.js](https://img.shields.io/badge/Node.js-LTS-43853D?style=flat&logo=node.js&logoColor=white) Node.js & Yarn

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/your-username/buildyourownphd.git # Make sure to use your fork's URL
cd buildyourownphd

# Install dependencies
bundle install
yarn install
```

### 2. Database Setup

```bash
# Create and migrate the database
rails db:create
rails db:migrate
```

### 3. Configure Your API Keys (BYOK)

<div align="center">

| Service | Purpose | Required |
|---------|---------|----------|
| ![OpenAI](https://img.shields.io/badge/OpenAI-Content%20Processing-blue) | Content chunking & summarization | ✅ Core Feature |
| ![ElevenLabs](https://img.shields.io/badge/ElevenLabs-Text%20to%20Speech-purple) | Audio generation | 🎧 Audio Feature |
| ![Stripe](https://img.shields.io/badge/Stripe-Payments-green) | Subscription billing | 💰 Optional |
| ![Postmark](https://img.shields.io/badge/Postmark-Email-orange) | Transactional emails | 📧 Production |

</div>

This platform uses external services for its core functionality. You will need to sign up for these services and get your own API keys. To add them to your application, you'll edit the encrypted credentials file.

To open the credentials file for editing, run:
```bash
EDITOR="code --wait" rails credentials:edit
```
*(Replace `code --wait` with your preferred editor, e.g., `vim`, `nano`, or `subl`)*

Then, add the following configuration. You don't need to fill out all of them to start, just the ones for the features you want to use.

```yaml
# config/credentials.yml.enc

# --------------------------------------------------------------------------
# Application Settings
# These are required for the application to run correctly.
# --------------------------------------------------------------------------
company_name: "Build Your Own PhD"
base_url: "http://localhost:3000" # Use your domain in production (e.g., "https://www.buildyourownphd.com")
admin_email: "you@example.com"

# --------------------------------------------------------------------------
# API Keys for Core Services (Bring Your Own Keys)
# --------------------------------------------------------------------------

# OpenAI for content processing (chunking, summarization, etc.)
# Get from: https://platform.openai.com/api-keys
openai_api_key: "sk-..."

# ElevenLabs for Text-to-Speech audio generation
# Get from: https://elevenlabs.io/ (Profile -> API Key)
elevenlabs_api_key: "..."

# Stripe for optional subscription/payment features
# Get from: https://dashboard.stripe.com/apikeys
stripe:
  api_key: "sk_test_..."
  publishable_key: "pk_test_..."
  # This is the API ID of your main subscription product's price in Stripe
  product_price_id: "price_..."
  # Get this from your webhook settings in Stripe if you use them
  webhook_secret: "whsec_..."

# Postmark for sending transactional emails in production
# Get from: https://account.postmarkapp.com/servers
postmark_api_token: "..."
```
Save and close the editor. This will encrypt your keys into `config/credentials.yml.enc` and save the master key in `config/master.key`. **Do not commit the `master.key` file to public repositories.**

### 4. Running the Application

```bash
# Start the development server, frontend watcher, and job processor
bin/dev
```

Open your browser to `http://localhost:3000` to see your application running!

<div align="center">

🎉 **Congratulations!** Your Build Your Own PhD platform is now running locally.

</div>

## 💻 Development

The development environment is managed by `foreman` via the `bin/dev` command. It starts the Rails server, the frontend build process, and the background job worker.

### 🧪 Testing
This project uses RSpec for comprehensive testing.

```sh
# Run all tests (headless)
bundle exec rspec

# Run tests in a real browser (opens a Chrome window)
HEADED=TRUE bundle exec rspec
```

### 📏 Code Quality
We use Rubocop to maintain code quality and a consistent style.

```sh
# Check for offenses
rubocop

# Automatically fix safe offenses
rubocop -a
```

## 🤝 Contributing

Contributions are welcome! If you'd like to help improve the platform, please feel free to submit a Pull Request.

<div align="center">

[![Contributors Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)

</div>

### 🛠️ Contributing Steps

1. 🍴 **Fork the Project**
2. 🌿 **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. ✅ **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4. 📤 **Push to the Branch** (`git push origin feature/AmazingFeature`)
5. 🔄 **Open a Pull Request**

### 💡 What We're Looking For

- 🐛 Bug fixes and improvements
- 📚 New learning features
- 🎨 UI/UX enhancements
- 📖 Documentation improvements
- 🧪 Test coverage increases

---

### ⭐ Star us on GitHub — it motivates us a lot!

[![GitHub stars](https://img.shields.io/github/stars/shreyas-makes/buildyourownphd.svg?style=social&label=Star)](https://github.com/shreyas-makes/buildyourownphd)
[![GitHub forks](https://img.shields.io/github/forks/shreyas-makes/buildyourownphd.svg?style=social&label=Fork)](https://github.com/shreyas-makes/buildyourownphd/fork)

**Built with ❤️ for lifelong learners everywhere**

</div>
