As a senior frontend developer, your task is to display the user's total Experience Points (XP) in the application's header. This provides immediate visual feedback for the gamification system.

**Context:**
The backend now awards XP. To make this visible and engaging, we will display the user's total XP in the main navigation bar and make it update in real-time when new points are awarded, using Hotwire.

**Acceptance Criteria (MVP):**
1.  The user's total XP is displayed in the main application layout for logged-in users.
2.  The XP count updates automatically, without a page reload, when the user earns more points.
3.  The implementation is simple, relying on Turbo Streams for real-time updates.

**Implementation Steps:**

**Part 1: Make the XP Updatable in Real-time**

1.  **Broadcast from the Model:**
    *   Update the `GamificationProfile` model to broadcast changes to a unique stream for the user.
    ```ruby
    # app/models/gamification_profile.rb
    class GamificationProfile < ApplicationRecord
      belongs_to :user

      # Broadcast updates to a stream like "user_1_gamification_profile"
      broadcasts_to ->(profile) { [profile.user, "gamification_profile"] }
    end
    ```

**Part 2: Display XP in the UI**

1.  **Create a Partial for the XP Counter:**
    *   Create a new partial `app/views/gamification_profiles/_profile.html.erb`. This will contain the display logic for the XP counter. The `dom_id` is crucial for Turbo Streams to target it.
    ```erb
    <%# app/views/gamification_profiles/_profile.html.erb %>
    <%= tag.div id: dom_id(profile), class: "xp-counter" do %>
      <span><%= profile.total_xp %> XP</span>
    <% end %>
    ```

2.  **Update the Main Application Layout:**
    *   In `app/views/layouts/application.html.erb`, find the section for authenticated users and render the new partial.
    *   Crucially, add the `turbo_stream_from` helper to subscribe to the updates.
    ```erb
    <%# app/views/layouts/application.html.erb %>
    <% if user_signed_in? %>
      <%# Subscribe to the gamification profile stream %>
      <%= turbo_stream_from current_user, "gamification_profile" %>

      <%# ... other authenticated user links ... %>

      <%# Render the XP counter %>
      <%= render current_user.gamification_profile %>
    <% else %>
      <%# ... guest user links ... %>
    <% end %>
    ```

**Testing (Manual):**
*   Log in. You should see "0 XP" in your navigation bar.
*   In a separate tab, open a piece of content and navigate through all the chunks to earn 10 XP.
*   Keep an eye on the navigation bar. As soon as you complete the last chunk, the "0 XP" text should instantly change to "10 XP" without the page reloading.
*   **No automated tests are needed for this MVP feature.** 