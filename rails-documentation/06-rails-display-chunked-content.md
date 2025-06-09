As a senior frontend developer using Rails, your task is to upgrade the content viewer page to display the AI-generated text chunks instead of the raw text. This will implement the core micro-learning reading experience.

**Context:**
The backend is now chunking content into smaller pieces. The content viewer page (`/contents/[id]`), however, still shows the original raw text. You will now change this page to fetch and display the content chunk by chunk, using a Stimulus controller for navigation.

**Acceptance Criteria:**
1.  The content viewer page (`/contents/[id]`) no longer displays the raw text.
2.  Instead, it fetches all the ordered chunks for that content from the `content_chunks` table.
3.  The page displays one chunk at a time.
4.  "Next" and "Previous" buttons allow the user to navigate between the chunks.
5.  A progress indicator (e.g., "Chunk 3 of 10") is clearly visible.
6.  The navigation buttons are disabled appropriately (e.g., "Previous" is disabled on the first chunk).

**Implementation Steps:**

**Part 1: Update Data Fetching**

1.  **Modify `ContentsController#show`:**
    *   Update the `show` action to eager-load the associated chunks in the correct order.
        ```ruby
        # app/controllers/contents_controller.rb
        def show
          @content = Current.user.contents.includes(:content_chunks).find(params[:id])
          @chunks = @content.content_chunks.order(:chunk_number)
        end
        ```

**Part 2: Create the Chunk Viewer**

1.  **Create a ViewComponent (Optional but Recommended):**
    *   For better encapsulation, create a `ChunkViewerComponent`.
        ```bash
        rails g component Learning::ChunkViewer
        ```
    *   This creates `app/components/learning/chunk_viewer_component.rb` and `...html.erb`.
    *   The component will take the chunks as an argument.
        ```ruby
        # app/components/learning/chunk_viewer_component.rb
        class Learning::ChunkViewerComponent < ViewComponent::Base
          def initialize(chunks:)
            @chunks = chunks
          end
        end
        ```
2.  **Create a Stimulus Controller:**
    *   Generate a new Stimulus controller: `rails g stimulus chunk-viewer`
    *   This creates `app/javascript/controllers/chunk_viewer_controller.js`.
    *   This controller will manage the state of the current chunk index and handle button clicks.
    ```javascript
    // app/javascript/controllers/chunk_viewer_controller.js
    import { Controller } from "@hotwired/stimulus"

    export default class extends Controller {
      static targets = ["chunk", "previousButton", "nextButton", "progress"]

      initialize() {
        this.index = 0
        this.showCurrentChunk()
      }

      next() {
        if (this.index < this.chunkTargets.length - 1) {
          this.index++
          this.showCurrentChunk()
        }
      }

      previous() {
        if (this.index > 0) {
          this.index--
          this.showCurrentChunk()
        }
      }

      showCurrentChunk() {
        this.chunkTargets.forEach((element, index) => {
          element.hidden = index !== this.index
        })
        this.previousButtonTarget.disabled = this.index === 0
        this.nextButtonTarget.disabled = this.index === this.chunkTargets.length - 1
        this.progressTarget.textContent = `Chunk ${this.index + 1} of ${this.chunkTargets.length}`
      }
    }
    ```

**Part 3: Integrate into Viewer Page**

1.  **Update `show.html.erb`:**
    *   Replace the old view logic with the new component and Stimulus controller hookup.
    ```erb
    <%# app/views/contents/show.html.erb %>
    <h1><%= @content.raw_content.truncate(50) %></h1>

    <% if @chunks.any? %>
      <div data-controller="chunk-viewer">
        <%# Render all chunks but hide them with 'hidden' attribute %>
        <div class="chunks-container">
          <% @chunks.each do |chunk| %>
            <div class="chunk" data-chunk-viewer-target="chunk" hidden>
              <p><%= chunk.text %></p>
            </div>
          <% end %>
        </div>

        <%# Navigation controls %>
        <div class="chunk-nav">
          <button data-action="click->chunk-viewer#previous" data-chunk-viewer-target="previousButton">Previous</button>
          <span data-chunk-viewer-target="progress"></span>
          <button data-action="click->chunk-viewer#next" data-chunk-viewer-target="nextButton">Next</button>
        </div>
      </div>
    <% else %>
      <p>This content is still being processed. Please check back later.</p>
    <% end %>

    <%= link_to "Back to Dashboard", dashboard_path %>
    ```

**Testing:**
*   Log in and go to your dashboard.
*   Click on a content item that has been successfully processed (chunked).
*   The viewer page should now show the first chunk of text.
*   The "Previous" button should be disabled.
*   Click "Next". The view should update to show the second chunk, and the progress indicator should update.
*   Navigate through all the chunks. The "Next" button should become disabled on the final chunk.
*   Verify that if you try to view content that has no chunks, you see the appropriate message.
