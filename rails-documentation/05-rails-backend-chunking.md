As a senior backend developer, your task is to replace the simulated processing job with a real one that uses AI to chunk text content. This is the first core AI feature of the application.

**Context:**
Currently, the `ContentProcessingJob` only waits for 5 seconds. You will now modify it to perform a real task: fetching content from a URL if necessary, and then using the OpenAI API to break the text into smaller, logical chunks.

**Acceptance Criteria:**
1.  A new `content_chunks` table exists in the database to store the text chunks.
2.  The `ContentProcessingJob` is updated to handle the chunking logic.
3.  If the content `type` is `url`, the system first fetches and parses the article text from the URL.
4.  The job calls the OpenAI GPT-4 API via a dedicated service object to segment the text.
5.  The returned text chunks are saved sequentially into the `content_chunks` table.
6.  The parent `contents` record status is updated to `ready` only after all chunks are successfully saved.
7.  Proper error handling is implemented for API calls and other failure points.

**Implementation Steps:**

**Part 1: Database Setup**

1.  **Create `content_chunks` Table:**
    *   Generate a new model and migration for the chunks.
        ```bash
        rails g model ContentChunk content:references chunk_number:integer text:text
        ```
    *   Run the migration: `rails db:migrate`.
2.  **Model Associations:**
    *   Set up the `has_many` association in the parent `Content` model.
        ```ruby
        # app/models/content.rb
        has_many :content_chunks, dependent: :destroy
        ```

**Part 2: Update Backend Processor (ActiveJob)**

1.  **Install Dependencies:**
    *   Add `gem 'ruby-openai'` for the OpenAI API.
    *   Add `gem 'article_extractor'` for parsing URLs.
    *   Run `bundle install`.
2.  **Environment Variables:**
    *   Add `OPENAI_API_KEY` to your encrypted Rails credentials: `rails credentials:edit`.
3.  **Create Service Objects:**
    *   It's best practice to encapsulate external API logic in service objects (Plain Old Ruby Objects).
    *   Create a directory `app/services/`.
    *   **URL Extractor Service:** `app/services/url_content_extractor.rb`
        ```ruby
        # app/services/url_content_extractor.rb
        class UrlContentExtractor
          def self.extract(url)
            ArticleExtractor.extract(url).content
          rescue StandardError => e
            Rails.logger.error "Failed to extract content from #{url}: #{e.message}"
            nil
          end
        end
        ```
    *   **AI Chunker Service:** `app/services/ai/chunker.rb` (namespaced in an `ai` folder)
        ```ruby
        # app/services/ai/chunker.rb
        class Ai::Chunker
          def initialize(client: OpenAI::Client.new)
            @client = client
          end

          def segment(text)
            prompt = "You are a text processing expert... [your detailed prompt here] ... The text to segment is:\n\n#{text}"
            response = @client.chat(
              parameters: {
                model: "gpt-4-turbo-preview",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
              }
            )
            JSON.parse(response.dig("choices", 0, "message", "content"))["chunks"]
          rescue StandardError => e
            Rails.logger.error "OpenAI API error: #{e.message}"
            []
          end
        end
        ```

**Part 3: Refactor `ContentProcessingJob`**

1.  **Update Job Logic:**
    *   Modify `app/jobs/content_processing_job.rb` to use the new services.
    ```ruby
    # app/jobs/content_processing_job.rb
    class ContentProcessingJob < ApplicationJob
      queue_as :default

      def perform(content_id)
        content = Content.find(content_id)
        content.update!(status: 'processing')

        # 1. Get text
        text_to_process = get_text_for(content)
        return content.update!(status: 'error', error_message: 'Failed to retrieve text.') if text_to_process.blank?

        # 2. Chunk text with AI
        chunks = Ai::Chunker.new.segment(text_to_process)
        return content.update!(status: 'error', error_message: 'Failed to chunk text.') if chunks.empty?

        # 3. Save chunks in a single transaction
        ActiveRecord::Base.transaction do
          chunks.each_with_index do |chunk_text, index|
            content.content_chunks.create!(text: chunk_text, chunk_number: index + 1)
          end
        end

        content.update!(status: 'ready')

      rescue StandardError => e
        content.update!(status: 'error', error_message: e.message)
        raise e
      end

      private

      def get_text_for(content)
        if content.content_type == 'URL'
          UrlContentExtractor.extract(content.raw_content)
        else
          content.raw_content
        end
      end
    end
    ```

**Testing:**
*   Write unit tests for the new service objects. Mock the APIs to test their logic.
*   Manually test the full flow:
    *   Submit a URL to a news article.
    *   Check the Sidekiq logs to see the processor running.
    *   Verify in the Rails console that the `content_chunks` table is populated correctly for the `Content`.
    *   Verify the parent `contents` item is marked as `ready`.
    *   Test with a plain text submission as well.
