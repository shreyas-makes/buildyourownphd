As a senior backend developer, your task is to create the backend for a minimal Spaced Repetition System (SRS). This involves using AI to generate a single flashcard (question and answer) for each content chunk.

**Context:**
This is the foundational step for the SRS feature. We will create a background job that calls OpenAI to generate one flashcard per text chunk and saves it to the database with a review date. For the MVP, the review logic will be extremely simple.

**Acceptance Criteria (MVP):**
1.  A `flashcards` table exists to store the generated questions and answers.
2.  A new background job, `FlashcardGenerationJob`, is created.
3.  This job uses OpenAI to generate one Q&A pair from a given text chunk.
4.  The generated flashcard is saved to the database, linked to the user and the chunk.
5.  The main `ContentProcessingJob` is updated to enqueue this new job for each chunk.

**Implementation Steps:**

**Part 1: Database Setup**

1.  **Create `flashcards` Table:**
    *   Generate a migration for a `Flashcard` model.
        ```bash
        rails g model Flashcard user:references content_chunk:references question:text answer:text review_at:datetime
        ```
    *   Run `rails db:migrate`.

2.  **Model Associations:**
    *   Set up the necessary associations.
        ```ruby
        # app/models/user.rb
        has_many :flashcards

        # app/models/content_chunk.rb
        has_one :flashcard

        # app/models/flashcard.rb
        belongs_to :user
        belongs_to :content_chunk
        ```

**Part 2: AI Flashcard Generation**

1.  **Create AI Service for Flashcards:**
    *   Create a new service `app/services/ai/flashcard_generator.rb`.
    ```ruby
    # app/services/ai/flashcard_generator.rb
    class Ai::FlashcardGenerator
      def initialize(client: OpenAI::Client.new)
        @client = client
      end

      def generate(text)
        prompt = "Generate a single question and answer pair from the following text. The question should test the main concept of the text. Return a JSON object with a 'question' key and an 'answer' key.\n\nText: #{text}"
        response = @client.chat(
          parameters: {
            model: "gpt-3.5-turbo", # Cheaper and faster for this simple task
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
          }
        )
        JSON.parse(response.dig("choices", 0, "message", "content"))
      rescue StandardError => e
        Rails.logger.error "OpenAI Flashcard Generation Error: #{e.message}"
        nil
      end
    end
    ```

2.  **Create the Background Job:**
    *   Generate a new job: `rails g job FlashcardGeneration`.
    *   This job will call the service and save the flashcard.
    ```ruby
    # app/jobs/flashcard_generation_job.rb
    class FlashcardGenerationJob < ApplicationJob
      queue_as :low_priority

      def perform(chunk_id)
        chunk = ContentChunk.find(chunk_id)
        user = chunk.content.user

        # Generate flashcard from the chunk's text
        qna = Ai::FlashcardGenerator.new.generate(chunk.text)
        return if qna.blank?

        # Save the flashcard
        chunk.create_flashcard!(
          user: user,
          question: qna["question"],
          answer: qna["answer"],
          review_at: Time.current # Due for review immediately
        )
      end
    end
    ```

**Part 3: Update Content Processing Pipeline**

1.  **Enqueue the New Job:**
    *   Modify the `ContentProcessingJob` to enqueue a `FlashcardGenerationJob` for each chunk, alongside the TTS job.
    ```ruby
    # app/jobs/content_processing_job.rb
    # ... inside perform method, after saving chunks ...

    # 4. Enqueue TTS and Flashcard jobs for each chunk
    saved_chunks.each do |chunk|
      TtsGenerationJob.perform_later(chunk.id)
      FlashcardGenerationJob.perform_later(chunk.id) # Add this line
    end

    content.update!(status: 'ready')
    ```

**Testing (Manual):**
*   Submit a new piece of content.
*   After the processing jobs have run, open the Rails console (`rails c`).
*   Check that flashcards have been created: `Flashcard.count`. There should be one for each chunk.
*   Inspect a flashcard: `Flashcard.last`. Verify it has a `question`, `answer`, and is associated with the correct user and chunk.
*   **No automated tests are needed for this MVP feature.** 