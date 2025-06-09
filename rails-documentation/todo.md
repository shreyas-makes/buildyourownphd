# 🚀 Build-Your-Own-PhD: Rails Project TODO

This document tracks the incremental build of the project on Rails, broken down into shippable phases.

## Phase 0: Project Setup (Speedrail)

- [ ] **Setup**: Initialize using Speedrail template: `speedrail/bin/speedrail buildyourownphd`.
- [ ] **Gems**: Add learning-specific gems to the `Gemfile`: `ruby-openai`, `elevenlabs-ruby`, `article_extractor`. (Speedrail includes Devise, Delayed Job, Tailwind+Flowbite, Active Admin, etc.).
- [ ] **Database**: PostgreSQL already configured in Speedrail template.
- [ ] **Admin Setup**: Create admin user via Rails console: `User.last.update(admin: true)`.
- [ ] **Initial Commit**: Customize landing page and commit the initial Speedrail setup.

---

## Phase 1: Core Content Ingestion and Processing

*   **Task 1: Customize Speedrail Authentication.**
    *   [ ] **Backend**: Speedrail includes Devise authentication pre-configured. Review `User` model and routes.
    *   [ ] **Database**: Users table already exists with Devise fields (email, encrypted_password, etc.).
    *   [ ] **Frontend**: Customize Devise views (`app/views/devise/`) using Flowbite components to match learning platform theme.
    *   [ ] **Backend**: Ensure controllers use `before_action :authenticate_user!` and `current_user` helper.
    *   [ ] **System Test**: Write RSpec system tests for user signup, login, logout, and accessing protected dashboard.

*   **Task 2: Content Submission UI.**
    *   [ ] **Backend**: Create a `DashboardController` with an `index` action that requires authentication.
    *   [ ] **Frontend**: Create the dashboard view (`app/views/dashboard/index.html.erb`) using Flowbite components.
    *   [ ] **Frontend**: Design a form for submitting URL or text using Rails `form_with` and Flowbite form styling. Include Stimulus controller for toggling input types.
    *   [ ] **RSpec Test**: Write system tests for authenticated user accessing dashboard and form interactions.

*   **Task 3: Backend Content Pipeline.**
    *   [ ] **Database**: Create a `contents` table migration (`user:references`, `content_type:string`, `raw_content:text`, `status:string` with default 'pending').
    *   [ ] **Backend**: Create a `ContentsController` with a `create` action and proper strong parameters.
    *   [ ] **Backend**: The `create` action saves content and redirects with flash notice using Turbo-compatible responses.
    *   [ ] **Backend**: Delayed Job is already configured in Speedrail. Create a `ContentProcessingJob` class (no inheritance needed).
    *   [ ] **Backend**: Enqueue job using Delayed Job syntax: `ContentProcessingJob.delay.perform(content.id)`.
    *   [ ] **Backend**: Job simulates work and updates status, with proper error handling.
    *   [ ] **RSpec Tests**: Write model validations, controller tests, and job tests with factories.

*   **Task 4: Real-time Content Display.**
    *   [ ] **Frontend**: Display user's content list on dashboard using Flowbite card components.
    *   [ ] **Frontend**: Wrap content list in Turbo Frame and add `turbo_stream_from` for real-time updates.
    *   [ ] **Backend**: Add `broadcasts_to` callback in `Content` model to automatically broadcast status changes.
    *   [ ] **Frontend**: Create `ContentsController#show` action and view using Flowbite layout components.
    *   [ ] **Frontend**: Display content details with status badges using Flowbite styling.
    *   [ ] **RSpec Tests**: Write system tests for real-time status updates and content viewing workflow.

---

## Phase 2: AI-Powered Content Chunking

*   **Task 5: AI-Powered Content Chunking.**
    *   [ ] **Database**: Create a `content_chunks` table migration (`content:references`, `chunk_number:integer`, `text:text`).
    *   [ ] **Backend**: Create a `UrlContentExtractor` service using `article_extractor` gem for URL parsing.
    *   [ ] **Backend**: Create an `Ai::Chunker` service using `ruby-openai` gem with cognitive load-based prompts.
    *   [ ] **Backend**: Update `ContentProcessingJob` to use these services and save chunks in database transaction.
    *   [ ] **Credentials**: Add OpenAI API key to Rails encrypted credentials.
    *   [ ] **RSpec Tests**: Test services with mocked API responses and proper error handling.

*   **Task 6: Interactive Chunk Viewer.**
    *   [ ] **Frontend**: Update `ContentsController#show` to load content with associated chunks using `includes`.
    *   [ ] **Frontend**: Replace raw text display with chunked content using Flowbite card styling.
    *   [ ] **Frontend**: Create a `ChunkViewer` Stimulus controller for navigation between chunks.
    *   [ ] **Frontend**: Add Flowbite-styled navigation buttons and progress indicators.
    *   [ ] **Frontend**: Implement keyboard navigation (arrow keys) for accessibility.
    *   [ ] **RSpec Tests**: Write system tests for chunk navigation and progress tracking.

---

## Phase 3: Dual Coding (Audio)

*   **Task 7: Text-to-Speech Pipeline.**
    *   [ ] **Backend**: Active Storage already configured in Speedrail. Create audio attachment for `ContentChunk` model.
    *   [ ] **Backend**: Create an `Ai::Tts` service using `elevenlabs-ruby` gem with professional voice settings.
    *   [ ] **Backend**: Create `TtsGenerationJob` (Delayed Job pattern) to process audio generation.
    *   [ ] **Backend**: Update `ContentProcessingJob` to enqueue TTS jobs for each chunk using `.delay` syntax.
    *   [ ] **Credentials**: Add ElevenLabs API key to Rails encrypted credentials.
    *   [ ] **RSpec Tests**: Test TTS service and job with mocked API responses and Active Storage.

*   **Task 8: Dual Coding Audio Interface.**
    *   [ ] **Frontend**: Add audio controls to chunk viewer using Flowbite media component styling.
    *   [ ] **Frontend**: Create `AudioPlayer` Stimulus controller for synchronized text-audio playback.
    *   [ ] **Frontend**: Implement play/pause, speed control, and progress tracking features.
    *   [ ] **Frontend**: Add visual feedback (highlighted text) synchronized with audio playback.
    *   [ ] **RSpec Tests**: Write system tests for audio playback functionality and accessibility.

---

## Phase 4: Gamification Engine

*   **Task 9: Gamification System.**
    *   [ ] **Database**: Create `gamification_profiles` and `achievements` models with proper associations.
    *   [ ] **Backend**: Create `GamificationService` with XP calculation including streak bonuses and difficulty multipliers.
    *   [ ] **Backend**: Integrate XP awards for content completion, quiz performance, and daily streaks.
    *   [ ] **Backend**: Add achievement triggers and badge system with predefined achievement types.
    *   [ ] **RSpec Tests**: Write comprehensive tests for XP calculations and achievement logic.

*   **Task 10: Gamification Dashboard.**
    *   [ ] **Frontend**: Create gamification dashboard section using Flowbite progress components and badges.
    *   [ ] **Frontend**: Display XP progress rings, level indicators, and recent achievements.
    *   [ ] **Frontend**: Add real-time XP updates using Turbo Streams and `broadcasts_to` pattern.
    *   [ ] **Frontend**: Create achievement notification system with Flowbite toast components.
    *   [ ] **RSpec Tests**: Write system tests for gamification UI and real-time updates.

---

## Phase 5: Spaced Repetition System (SRS)

*   **Task 11: Spaced Repetition System.**
    *   [ ] **Database**: Create `spaced_repetition_cards` with SM-2 algorithm fields (`interval`, `ease_factor`, `due_at`, `repetitions`).
    *   [ ] **Backend**: Create `FlashcardGenerationJob` using Delayed Job to generate Q&A from chunks via OpenAI.
    *   [ ] **Backend**: Implement `SpacedRepetitionService` with SM-2 algorithm for optimal review scheduling.
    *   [ ] **Backend**: Add card generation trigger after successful content chunking.
    *   [ ] **RSpec Tests**: Test card generation, SM-2 calculations, and scheduling logic.

*   **Task 12: Review Interface.**
    *   [ ] **Backend**: Create `ReviewsController` with due card fetching and review result processing.
    *   [ ] **Frontend**: Build review interface at `/review` using Flowbite card flip components.
    *   [ ] **Frontend**: Create `FlashcardReview` Stimulus controller for card interactions and difficulty rating.
    *   [ ] **Frontend**: Add review session tracking with progress indicators and completion celebration.
    *   [ ] **RSpec Tests**: Write system tests for complete review session workflow and scheduling updates.
