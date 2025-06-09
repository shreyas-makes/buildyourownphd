As a senior full-stack developer, your task is to build the user interface for the Spaced Repetition System (SRS). This page will allow users to review their due flashcards one by one.

**Context:**
The backend now generates flashcards. This final MVP task is to create a simple, usable interface for the core SRS loop: See a question, reveal the answer, and mark it as "Correct" or "Incorrect" to schedule the next review.

**Acceptance Criteria (MVP):**
1.  A dedicated review page exists at `/review`.
2.  The page displays one due flashcard at a time, showing only the question initially.
3.  A "Show Answer" button reveals the answer.
4.  After the answer is shown, "Correct" and "Incorrect" buttons appear.
5.  Clicking "Correct" schedules the next review for 24 hours later and loads the next card.
6.  Clicking "Incorrect" schedules the next review for 1 hour later and loads the next card.
7.  The entire interaction is handled by a single Stimulus controller.

**Implementation Steps:**

**Part 1: Backend Setup**

1.  **Create Controller and Route:**
    *   Create a route for the review page in `config/routes.rb`:
        ```ruby
        get 'review', to: 'reviews#index'
        resources :flashcards, only: [] do
          member do
            patch :mark_correct
            patch :mark_incorrect
          end
        end
        ```
    *   Generate a `ReviewsController` with an `index` action to fetch the due cards.
        ```ruby
        # app/controllers/reviews_controller.rb
        class ReviewsController < ApplicationController
          def index
            @due_flashcards = current_user.flashcards.where("review_at <= ?", Time.current).order("RANDOM()")
          end
        end
        ```
    *   Create a `FlashcardsController` to handle marking cards.
        ```ruby
        # app/controllers/flashcards_controller.rb
        class FlashcardsController < ApplicationController
          def mark_correct
            flashcard = current_user.flashcards.find(params[:id])
            flashcard.update(review_at: 24.hours.from_now)
            head :ok
          end

          def mark_incorrect
            flashcard = current_user.flashcards.find(params[:id])
            flashcard.update(review_at: 1.hour.from_now)
            head :ok
          end
        end
        ```

**Part 2: Frontend Review UI**

1.  **Create the Review View:**
    *   Create the view `app/views/reviews/index.html.erb`.
    ```erb
    <%# app/views/reviews/index.html.erb %>
    <h1>Review Due Cards</h1>

    <div data-controller="review">
      <% if @due_flashcards.any? %>
        <% @due_flashcards.each do |flashcard| %>
          <div class="flashcard" data-review-target="card" hidden>
            <p><strong>Question:</strong> <%= flashcard.question %></p>
            
            <p data-review-target="answer" hidden>
              <strong>Answer:</strong> <%= flashcard.answer %>
            </p>

            <button data-action="click->review#showAnswer" data-review-target="showButton">Show Answer</button>

            <div data-review-target="feedbackButtons" hidden>
              <button data-action="click->review#markCorrect" data-flashcard-id="<%= flashcard.id %>">Correct</button>
              <button data-action="click->review#markIncorrect" data-flashcard-id="<%= flashcard.id %>">Incorrect</button>
            </div>
          </div>
        <% end %>
        <p data-review-target="noMoreCards" hidden>All done for now!</p>
      <% else %>
        <p>No cards due for review. Great job!</p>
      <% end %>
    </div>
    ```

2.  **Create the Stimulus Controller:**
    *   Generate `app/javascript/controllers/review_controller.js`.
    ```javascript
    // app/javascript/controllers/review_controller.js
    import { Controller } from "@hotwired/stimulus"

    export default class extends Controller {
      static targets = ["card", "answer", "showButton", "feedbackButtons", "noMoreCards"]

      initialize() {
        this.index = 0
        this.showCurrentCard()
      }

      showCurrentCard() {
        if (this.index >= this.cardTargets.length) {
          this.noMoreCardsTarget.hidden = false
          return
        }
        this.cardTargets.forEach((card, i) => card.hidden = i !== this.index)
      }

      showAnswer() {
        this.answerTargets[this.index].hidden = false
        this.showButtonTargets[this.index].hidden = true
        this.feedbackButtonsTargets[this.index].hidden = false
      }

      async markCorrect(event) {
        await this.rateCard(event.currentTarget.dataset.flashcardId, 'correct')
      }

      async markIncorrect(event) {
        await this.rateCard(event.currentTarget.dataset.flashcardId, 'incorrect')
      }
      
      async rateCard(cardId, rating) {
        const url = `/flashcards/${cardId}/mark_${rating}`
        const csrfToken = document.querySelector('meta[name="csrf-token"]').content
        
        await fetch(url, {
          method: 'PATCH',
          headers: { 'X-CSRF-Token': csrfToken }
        })

        this.index++
        this.showCurrentCard()
      }
    }
    ```

**Testing (Manual):**
*   Log in and go to `/review`. If you have due cards, the first one should appear.
*   Click "Show Answer". The answer should appear, and the feedback buttons should become visible.
*   Click "Correct". The card should disappear, and the next due card should appear.
*   Check the database (`rails c` -> `Flashcard.find(...)`) to confirm its `review_at` is now in the future.
*   Repeat until all cards are reviewed. You should see the "All done" message.
*   **No automated tests are needed for this MVP feature.** 