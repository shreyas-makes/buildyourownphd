As a senior backend developer, your task is to implement a minimal gamification engine. For the MVP, this will simply award a fixed amount of Experience Points (XP) when a user finishes reading a piece of content.

**Context:**
This is the first step in building the gamification features. To keep it simple, we will add a `total_xp` counter to the user and create an endpoint that the frontend can call when the user clicks the "Next" button on the final content chunk.

**Acceptance Criteria (MVP):**
1.  A `gamification_profiles` table exists to store user XP.
2.  An endpoint exists (e.g., `PATCH /content_chunks/:id/complete`) that can be called to mark a chunk as "completed" by a user.
3.  When the final chunk of a piece of content is completed, the user is awarded 10 XP.
4.  The system is simple and proves the concept of awarding points for learning.

**Implementation Steps:**

**Part 1: Database Setup**

1.  **Create `gamification_profiles` Table:**
    *   Generate a migration for a new `GamificationProfile` model that belongs to a user and tracks their XP.
        ```bash
        rails g model GamificationProfile user:references total_xp:integer
        ```
    *   Update the migration to set a default value for `total_xp`.
        ```ruby
        # db/migrate/xxxxxxxx_create_gamification_profiles.rb
        class CreateGamificationProfiles < ActiveRecord::Migration[8.0]
          def change
            create_table :gamification_profiles do |t|
              t.references :user, null: false, foreign_key: true
              t.integer :total_xp, default: 0

              t.timestamps
            end
          end
        end
        ```
    *   Run `rails db:migrate`.

2.  **Set up Model Associations:**
    *   Update the `User` and `GamificationProfile` models.
        ```ruby
        # app/models/user.rb
        has_one :gamification_profile
        after_create :create_gamification_profile

        # app/models/gamification_profile.rb
        belongs_to :user
        ```

**Part 2: Create the XP Award Logic**

1.  **Add a New Route:**
    *   In `config/routes.rb`, add a member route to the `content_chunks` resource.
        ```ruby
        # config/routes.rb
        resources :contents, only: [:create, :show] do
          resources :content_chunks, only: [] do
            member do
              patch :complete
            end
          end
        end
        ```

2.  **Create the Controller Action:**
    *   Create a new controller `app/controllers/content_chunks_controller.rb`.
    *   The `complete` action will handle awarding XP.
        ```ruby
        # app/controllers/content_chunks_controller.rb
        class ContentChunksController < ApplicationController
          def complete
            chunk = ContentChunk.find(params[:id])
            content = chunk.content
            
            # Check if this is the last chunk
            if chunk.chunk_number >= content.content_chunks.count
              profile = current_user.gamification_profile
              profile.update(total_xp: profile.total_xp + 10)
            end

            head :ok
          end
        end
        ```

**Part 3: Update the Frontend to Call the Endpoint**

1.  **Modify Stimulus Controller:**
    *   Update the `chunk_viewer_controller.js` to call our new endpoint when the "Next" button is clicked.
    ```javascript
    // app/javascript/controllers/chunk_viewer_controller.js
    // ... existing code ...
    export default class extends Controller {
      static targets = ["chunk", "previousButton", "nextButton", "progress", "audioPlayer"]
      static values = { chunkIds: Array }

      // ... initialize, previous, showCurrentChunk methods ...

      next() {
        this.markChunkAsComplete() // Call the new method
        this.pauseCurrentAudio()
        if (this.index < this.chunkTargets.length - 1) {
          this.index++
          this.showCurrentChunk()
        }
      }

      markChunkAsComplete() {
        const chunkId = this.chunkIdsValue[this.index]
        const url = `/contents/0/content_chunks/${chunkId}/complete` // content_id is not used
        const csrfToken = document.querySelector('meta[name="csrf-token"]').content

        fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken
          }
        })
      }
    }
    ```

2.  **Update View to Pass Chunk IDs:**
    *   In `app/views/contents/show.html.erb`, pass the list of chunk IDs to the Stimulus controller.
    ```erb
    <%# app/views/contents/show.html.erb %>
    <div data-controller="chunk-viewer"
         data-chunk-viewer-chunk-ids-value="<%= @chunks.map(&:id) %>">
      <%# ... rest of the view ... %>
    </div>
    ```

**Testing (Manual):**
*   Log in and view a piece of content with multiple chunks.
*   Open the Rails console (`rails c`) and check your XP: `User.last.gamification_profile.total_xp`. It should be 0.
*   Navigate through all the chunks using the "Next" button.
*   After clicking "Next" on the last chunk, check your XP again in the console. It should now be 10.
*   **No automated tests are needed for this MVP feature.** 