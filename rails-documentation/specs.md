# 📘 Product Specification: buildyourownphd.com

## 🧠 Overview

**buildyourownphd.com** is a platform that empowers learners to curate and manage their self-directed PhD journey using proven psychological learning principles. Users can compile various learning resources, which are then processed using AI and converted into interactive, science-backed learning experiences that maximize retention and engagement through dual coding, chunking, gamification, and memory enhancement techniques.

---

## 🧩 Core Learning Psychology Features

### 1. **Dual Coding Theory Implementation**

*   **Multi-Modal Processing**:
    *   **Visual Channel**: Rich text rendering with syntax highlighting, interactive diagrams, mind maps, and concept visualization using server-rendered HTML and sprinkles of JavaScript.
    *   **Auditory Channel**: High-quality AI-generated audio with synchronized text highlighting, managed via Stimulus controllers.
    *   **Synchronized Learning**: Real-time switching between visual and auditory modes with progress preservation.

*   **Interactive Visual Elements**:
    *   Auto-generated concept maps showing relationships between topics.
    *   Interactive infographics created from content analysis.
    *   Visual memory aids with spatial arrangement of information.
    *   Progressive disclosure interface preventing cognitive overload.

### 2. **Intelligent Content Chunking & Micro-Learning**

*   **AI-Powered Segmentation**:
    *   Break content into optimal 5-15 minute learning segments based on cognitive load theory.
    *   Use natural language processing to identify conceptual boundaries.
    *   Maintain narrative flow while creating digestible chunks.
    *   Adaptive chunking based on user comprehension rates.

*   **Micro-Learning Sessions**:
    *   Just-in-time learning modules for specific concepts.
    *   Bite-sized reviews integrated into daily workflows.
    *   Contextual micro-assessments within content.
    *   Progress tracking for individual micro-sessions.

### 3. **Comprehensive Gamification System**

*   **Experience Points (XP) Engine**:
    *   Multi-factor XP calculation: base activity points + performance multiplier + streak bonus + difficulty adjustment.
    *   Different XP values for reading completion (10), quiz completion (15), streak maintenance (5), concept mastery (25).
    *   Dynamic XP scaling based on content difficulty and user proficiency.

*   **Achievement & Badge System**:
    *   **Learning Milestones**: "First Module", "Week Warrior", "Knowledge Seeker".
    *   **Behavioral Achievements**: "Consistent Learner", "Quiz Master", "Streak Legend".
    *   **Mastery Badges**: Subject-specific expertise recognition.
    *   **Social Achievements**: "Study Buddy", "Knowledge Sharer", "Mentor".

*   **Visual Progress Dashboards**:
    *   Interactive progress rings showing daily/weekly/monthly goals.
    *   Knowledge tree visualization showing learning path progression.
    *   Retention heatmaps displaying memory strength across topics.
    *   Comparative analytics with anonymized peer data.

### 4. **Advanced Memory Enhancement Techniques**

*   **AI-Generated Mnemonics**:
    *   Acronym generation for complex concepts.
    *   Visual association creation using AI image description.
    *   Narrative-based memory stories connecting disparate facts.
    *   Personalized mnemonics based on user interests and background.

*   **Spaced Repetition Engine**:
    *   SM-2 algorithm with adaptive modifications based on individual forgetting curves.
    *   Intelligent scheduling considering user timezone, preferences, and performance patterns.
    *   Difficulty adjustment based on repeated performance.
    *   Cross-content spaced repetition linking related concepts.

*   **Memory Palace Integration**:
    *   Virtual 3D environments for spatial memory techniques.
    *   Room-based organization of learning materials.
    *   Interactive placement of concepts in virtual spaces.
    *   Guided tours through memory palaces for review sessions.

### 5. **Interactive Drag-and-Drop Learning Tools**

*   **Dynamic Quiz Builder**:
    *   Drag-and-drop question creation from processed content.
    *   Multiple question types: matching, sequencing, categorization, concept mapping.
    *   Real-time feedback with explanations for incorrect answers.
    *   Adaptive difficulty based on performance patterns.

*   **Content Organization Interface**:
    *   Visual learning path builder with drag-and-drop modules.
    *   Dependency mapping showing prerequisite relationships.
    *   Custom curriculum creation with AI-suggested improvements.
    *   Collaborative content sharing and remixing.

---

## 🛠️ Technical Stack (Speedrail Template)

### **Core Framework**

*   **Backend & Frontend**: Ruby on Rails 8 with Speedrail template
*   **Database**: PostgreSQL
*   **Job Queue**: Delayed Job (Speedrail default) - database-based, no Redis required
*   **Real-time**: Action Cable powering Hotwire's Turbo Streams

### **Speedrail Frontend Stack**

*   **Interactivity**: Hotwire (Turbo Drive, Frames, Streams) & Stimulus
*   **Styling**: Tailwind CSS + Flowbite components (Speedrail default)
*   **Design System**: Flowbite + Tailwind UI components
*   **Testing**: RSpec test suite (Speedrail default)
*   **Interactive Components**: Stimulus controllers wrapping libraries like `@dnd-kit` (drag-drop), Chartkick (analytics), and Three.js (3D memory palace).

### **Speedrail Backend Features**

*   **Authentication**: Devise gem (Speedrail default)
*   **Admin Panel**: Active Admin with Tailwind CSS styling
*   **Blog CMS**: Rich text blog with embedded content
*   **Payments**: Stripe Checkout embedded portal
*   **A/B Testing**: Split gem for feature testing
*   **SEO**: Metamagic gem for meta tags
*   **Background Jobs**: Delayed Job for AI processing pipeline
*   **API Integrations**: Service objects with Delayed Job for external AI services
*   **File Storage**: Active Storage for handling uploads to S3/external storage

### **AI Services**

*   **Content Processing**: `ruby-openai` gem for GPT-4 (chunking, summarization, quiz generation).
*   **Transcription & TTS**: `elevenlabs-ruby` gem for high-quality TTS.
*   **Memory Aids**: `anthropic` gem for Claude (mnemonic generation).
*   **URL Content Extraction**: `article_extractor` gem or custom service.

### **Infrastructure**

*   **Hosting**: Render, Fly.io, or Heroku
*   **CDN**: Cloudflare
*   **Analytics**: Mixpanel for learning behavior tracking
*   **Monitoring**: Sentry for error tracking, Uptime Robot for service monitoring

---

## 📂 Rails File Structure

```
buildyourownphd/
├── app/
│   ├── assets/
│   │   ├── builds/         # Compiled CSS/JS output from Propshaft/Sprockets
│   │   └── images/
│   ├── channels/           # Action Cable channels for Turbo Streams
│   ├── components/         # ViewComponent classes
│   │   ├── learning/
│   │   ├── gamification/
│   │   └── visualizations/
│   ├── controllers/
│   │   ├── contents_controller.rb
│   │   ├── dashboard_controller.rb
│   │   └── ...
│   ├── helpers/
│   ├── javascript/
│   │   ├── controllers/    # Stimulus controllers
│   │   └── application.js
│   ├── jobs/               # Delayed Job background jobs
│   │   ├── content_processing_job.rb
│   │   ├── text_chunking_job.rb
│   │   └── tts_generation_job.rb
│   ├── mailers/
│   ├── models/
│   │   ├── user.rb
│   │   ├── content.rb
│   │   └── content_chunk.rb
│   ├── services/           # Plain Old Ruby Objects for business logic
│   │   ├── ai/
│   │   │   ├── chunker.rb  # Interface for OpenAI chunking
│   │   │   └── tts.rb      # Interface for ElevenLabs TTS
│   │   └── url_content_extractor.rb
│   └── views/
│       ├── layouts/
│       ├── contents/
│       └── dashboard/
├── bin/
│   └── rails
├── config/
│   ├── application.rb
│   ├── routes.rb
│   └── initializers/
├── db/
│   ├── migrate/
│   └── schema.rb
├── Gemfile
├── lib/
│   └── tasks/
├── public/
├── spec/                   # RSpec test suite (Speedrail default)
│   ├── system/             # System tests using Capybara
│   ├── controllers/
│   ├── models/
│   ├── jobs/
│   └── services/
└── Rakefile
```

---

## ⚙️ Advanced Data Handling

### **Learning Analytics Data Model (ActiveRecord)**

```ruby
# app/models/learning_session.rb
class LearningSession < ApplicationRecord
  belongs_to :user
  belongs_to :content
  has_many :interaction_events
end

# app/models/spaced_repetition_card.rb
class SpacedRepetitionCard < ApplicationRecord
  belongs_to :content_chunk
  belongs_to :user
end

# app/models/gamification_profile.rb
class GamificationProfile < ApplicationRecord
  belongs_to :user
  has_many :achievements
end
```

### **Memory Enhancement Data Structures (ActiveRecord)**

```ruby
# app/models/memory_palace.rb
class MemoryPalace < ApplicationRecord
  belongs_to :user
  has_many :memory_rooms
end

# app/models/mnemonic_device.rb
class MnemonicDevice < ApplicationRecord
  belongs_to :content
end
```

---

## 🛡️ Enhanced Error Handling Strategies

### **Learning Algorithm Resilience**

*   **Spaced Repetition Fallbacks**: Graceful degradation within service objects.
*   **Gamification Error Handling**: Job retries using Delayed Job configuration.
*   **Memory Technique Errors**: Service objects return nil or a fallback, handled in the controller/view.

### **AI Service Reliability**

*   **Content Processing Resilience**:
    *   Use of gems with built-in retries (`Faraday::Retry`).
    *   Circuit breaker patterns (`stoplight` gem).
    *   Queuing jobs for retry on API failures.

---

## 🧪 Enhanced Testing Plan

### **Learning Algorithm Testing**

*   **Unit & Integration Tests**: RSpec or Minitest for models, services, and jobs.
*   **System Tests**: Capybara to simulate full user workflows.

### **Memory Technique Validation**

*   Effectiveness measured through analytics data.

### **Rails System Testing & Capybara**

*   **Advanced Learning Workflow Testing**: End-to-end tests covering content submission, processing, and interactive learning with Hotwire.
*   **Browser Testing**: Headless browser tests for CI/CD.
*   **Performance Testing**: Tools like `rack-mini-profiler` in development.

### **Learning-Specific Test Coverage**

*   **Cognitive Load Testing**: Validated through UI/UX design principles and user feedback.
*   **Retention and Recall Testing**: Measured via analytics and spaced repetition performance.

---

## 🚀 Enhanced Deployment Strategy

### **Learning Data Migration**

*   **User Progress Preservation**: Handled through standard Rails database migrations (`db/migrate`). Zero-downtime deployments achieved with careful migration design and hosting provider features.

### **A/B Testing Infrastructure**

*   **Feature Flags**: Gems like `flipper` to manage A/B tests for algorithms and features.

### **Performance Optimization**

*   **Database**: Eager loading (`includes`), database indexing, and caching (Rails Caching).
*   **Background Jobs**: Optimizing job concurrency and resource usage in Delayed Job.

---

## 📊 Success Metrics & Learning Outcomes

### **Learning Effectiveness Metrics**

*   **Retention Rates**: 30-day, 90-day, and 1-year knowledge retention.
*   **Engagement Metrics**: Daily active users, session duration, content completion rates.
*   **Learning Velocity**: Time to concept mastery, learning path completion.
*   **Transfer Learning**: Application of learned concepts to new contexts.

### **Gamification Impact Measurement**

*   **Behavioral Changes**: Pre/post gamification engagement comparison.
*   **Motivation Sustainability**: Long-term engagement with gamified elements.
*   **Learning Quality**: Impact of gamification on actual knowledge retention.
*   **User Satisfaction**: Perceived value of gamification features.

### **Memory Technique Effectiveness**

*   **Recall Improvement**: Measured improvement in information recall.
*   **Technique Preference**: User adoption rates for different memory aids.
*   **Long-term Retention**: Sustained memory improvement over time.
*   **Cross-Content Application**: Transfer of memory techniques to new material.
--- 