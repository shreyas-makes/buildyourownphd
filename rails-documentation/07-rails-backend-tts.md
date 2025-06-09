As a senior backend developer, your task is to add Text-to-Speech (TTS) generation to the content processing pipeline. This will create the audio component needed for the "Dual Coding" feature.

**Context:**
The current pipeline fetches content and chunks it into text. You will now extend this by adding a step that takes each text chunk, generates a corresponding audio file using the ElevenLabs API, and attaches it to the chunk record using Active Storage.

**Acceptance Criteria:**
1.  The `content_chunks` table is modified to support attached audio. (Active Storage handles this).
2.  The main `ContentProcessingJob` enqueues a new `TtsGenerationJob` for each chunk.
3.  The `TtsGenerationJob` calls the ElevenLabs API to generate an audio file.
4.  The returned audio file is uploaded via Active Storage and attached to the `ContentChunk`.
5.  This process happens in the background and failures do not block the main content processing flow.

**Implementation Steps:**

**Part 1: Database and Storage Setup**

1.  **Install Active Storage:**
    *   Run `rails active_storage:install`. This creates migrations for the `active_storage_blobs` and `active_storage_attachments` tables.
    *   Run `rails db:migrate`.
2.  **Configure Storage Service:**
    *   In `config/storage.yml`, configure your storage service (e.g., Amazon S3, Google Cloud, or just local storage for development). For local, it's already set up.
    *   In `config/environments/development.rb` (and other environments), set `config.active_storage.service = :local`.
3.  **Associate Audio with Chunk:**
    *   In the `ContentChunk` model, declare the attachment:
        ```ruby
        # app/models/content_chunk.rb
        class ContentChunk < ApplicationRecord
          belongs_to :content
          has_one_attached :audio
        end
        ```

**Part 2: Update Backend Processing**

1.  **Install Dependencies:**
    *   Add `gem 'elevenlabs-ruby'` to your `Gemfile` and run `bundle install`.
2.  **Environment Variables:**
    *   Add `ELEVENLABS_API_KEY` to your encrypted Rails credentials: `rails credentials:edit`.
3.  **Create TTS Service Object:**
    *   Create a service `app/services/ai/tts.rb` to encapsulate the ElevenLabs API call.
    ```ruby
    # app/services/ai/tts.rb
    require "elevenlabs"

    class Ai::Tts
      def initialize(client: Elevenlabs::Client.new(api_key: Rails.application.credentials.elevenlabs_api_key))
        @client = client
      end

      # Returns the audio stream
      def generate(text, voice_id: "21m00Tcm4TlvDq8ikWAM") # Example voice: Rachel
        @client.text_to_speech.stream(voice_id: voice_id, text: text)
      rescue StandardError => e
        Rails.logger.error "ElevenLabs API error: #{e.message}"
        nil
      end
    end
    ```
4.  **Create a New Job for TTS:**
    *   Generate a new job: `rails g job TtsGeneration`.
        ```ruby
        # app/jobs/tts_generation_job.rb
        class TtsGenerationJob < ApplicationJob
          queue_as :low_priority

          def perform(chunk_id)
            chunk = ContentChunk.find(chunk_id)

            # Generate audio stream
            audio_stream = Ai::Tts.new.generate(chunk.text)
            return if audio_stream.nil?

            # Attach the audio using Active Storage
            chunk.audio.attach(
              io: StringIO.new(audio_stream),
              filename: "#{chunk.id}.mp3",
              content_type: "audio/mpeg"
            )
          end
        end
        ```
5.  **Update `ContentProcessingJob`:**
    *   Modify the main processing job to enqueue a `TtsGenerationJob` for each chunk after it has been saved.
    ```ruby
    # app/jobs/content_processing_job.rb
    # ... inside perform method, after saving chunks ...

    # 3. Save chunks and enqueue TTS jobs
    saved_chunks = []
    ActiveRecord::Base.transaction do
      chunks.each_with_index do |chunk_text, index|
        saved_chunks << content.content_chunks.create!(text: chunk_text, chunk_number: index + 1)
      end
    end

    # 4. Enqueue TTS jobs for each chunk
    saved_chunks.each do |chunk|
      TtsGenerationJob.perform_later(chunk.id)
    end

    content.update!(status: 'ready')
    ```

**Testing:**
*   Write a unit test for `TtsGenerationJob`. Mock the `Ai::Tts` service and the Active Storage attachment to verify the logic.
*   Manually test the full flow:
    *   Submit a new piece of content.
    *   Monitor your Sidekiq dashboard. You should see the `ContentProcessingJob` run, followed by a series of `TtsGenerationJob`s (one for each chunk).
    *   After a job is complete, check the `ContentChunk` in the console (`chunk = ContentChunk.last`).
    *   Verify that `chunk.audio.attached?` is true.
    *   Get the URL for the audio with `rails_blob_url(chunk.audio)`. Accessing this URL in your browser should play the generated audio.
