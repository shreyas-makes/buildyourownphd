As a senior Rails developer, your task is to build the UI for submitting new learning content. This will be a form on the user's dashboard.

**Context:**
This task builds upon the Rails 8 built-in authentication system. We will create a form on the authenticated dashboard where users can input either a URL or raw text to be processed.

**Acceptance Criteria:**
1.  A dedicated page at `/dashboard` exists for logged-in users.
2.  The dashboard contains a form to create a new `Content` record.
3.  The form has fields for `type` (URL or Text, perhaps using radio buttons or a select tag) and `raw_content` (a text field for URL, a textarea for text).
4.  The form should have a "Submit" button.
5.  When submitted, the form should make a `POST` request to a `ContentsController#create` action.
6.  The UI should be built using standard Rails form helpers and styled with Tailwind CSS. We can use a Stimulus controller for minor UI enhancements, like showing/hiding the correct input field.

**Implementation Steps:**

**Part 1: The Dashboard**

1.  **Dashboard Page:**
    *   Verify the `DashboardController` and its `index` view (`app/views/dashboard/index.html.erb`) exist from the previous authentication step and are protected.
    *   This will be the main container for our new form.

**Part 2: Build the Content Submission Form**

1.  **Model Object:**
    *   In the `DashboardController#index` action, instantiate a new content object for the form builder: `@content = Content.new`.
2.  **Form View:**
    *   In `app/views/dashboard/index.html.erb`, use `form_with` to build the submission form.
    *   The form should be pointed at the `Content` model instance (`model: @content`).
        ```erb
        <%# app/views/dashboard/index.html.erb %>
        <h2>Submit New Content</h2>
        <%= form_with model: @content do |form| %>
          <div class="field">
            <%= form.label :content_type, "Type" %>
            <%# Example using a select dropdown %>
            <%= form.select :content_type, ["URL", "Text"], {}, { "data-action": "change->form-visibility#toggle" } %>
          </div>

          <div class="field" data-form-visibility-target="urlInput">
            <%= form.label :raw_content, "URL" %>
            <%= form.url_field :raw_content, placeholder: "https://example.com/article" %>
          </div>

          <div class="field" data-form-visibility-target="textInput" hidden>
            <%= form.label :raw_content, "Text" %>
            <%= form.text_area :raw_content, placeholder: "Paste your text here..." %>
          </div>

          <div class="actions">
            <%= form.submit "Submit for Processing" %>
          </div>
        <% end %>
        ```
3.  **Controller and Routes:**
    *   Ensure you have a `ContentsController` with a `create` action.
    *   Ensure your `config/routes.rb` has the necessary resource route: `resources :contents, only: [:create, :show]`.
    *   The `create` action will handle the form submission, which will be implemented in the next phase.
        ```ruby
        # app/controllers/contents_controller.rb
        class ContentsController < ApplicationController
          def create
            @content = Current.user.contents.build(content_params)
            if @content.save
              # Logic to be added in next step
              redirect_to dashboard_path, notice: "Content submitted successfully!"
            else
              # Re-render the dashboard or handle error
              render 'dashboard/index', status: :unprocessable_entity
            end
          end

          private

          def content_params
            params.require(:content).permit(:content_type, :raw_content)
          end
        end
        ```

**Part 3: Add Interactivity (Optional)**

1.  **Stimulus Controller:**
    *   Create a Stimulus controller (`app/javascript/controllers/form_visibility_controller.js`) to toggle the visibility of the URL field vs. the Textarea based on the select dropdown's value.
    ```javascript
    // app/javascript/controllers/form_visibility_controller.js
    import { Controller } from "@hotwired/stimulus"

    export default class extends Controller {
      static targets = ["urlInput", "textInput"]

      toggle(event) {
        const selectedType = event.target.value
        if (selectedType === "URL") {
          this.urlInputTarget.hidden = false
          this.textInputTarget.hidden = true
        } else {
          this.urlInputTarget.hidden = true
          this.textInputTarget.hidden = false
        }
      }
    }
    ```
2.  **Connect in HTML:**
    *   Add `data-controller="form-visibility"` to the `form_with` tag. The `data-action` and `data-targets` shown in the ERB above will now be active.

**Testing:**
*   Manually test the form on the dashboard.
*   Switch between "URL" and "Text" to see if the correct input field is shown.
*   Submit the form. For now, a successful submission should just save the record and redirect you to the dashboard with a success message.
*   Write a system test to automate filling out and submitting the form.
