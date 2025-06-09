As a senior frontend developer working with Rails, your task is to display the user's submitted content on their dashboard and create a viewer page. This will close the loop on the initial content submission feature by providing real-time feedback on the content's status.

**Context:**
This task builds on the previous steps. We now have a background job that processes content and updates its status. This guide will make that status change visible to the user *in real-time* using Hotwire's Turbo Streams.

**Acceptance Criteria:**
1.  The user's dashboard (`/dashboard`) displays a list of all content they have submitted.
2.  The list shows the content's snippet and its current status (`pending`, `processing`, `ready`, etc.).
3.  The list updates automatically without a page reload as the content's status changes.
4.  Each item in the list links to a dedicated viewer page (`/contents/[id]`).
5.  The viewer page fetches and displays the `raw_content` of the selected item.

**Implementation Steps:**

**Part 1: Content List View**

1.  **Update Dashboard Controller:**
    *   In `DashboardController#index`, fetch the user's content to be displayed in the view:
        ```ruby
        # app/controllers/dashboard_controller.rb
        def index
          @content = Content.new
          @contents = Current.user.contents.order(created_at: :desc)
        end
        ```
2.  **Create a Partial for the Content List:**
    *   In `app/views/dashboard/index.html.erb`, render the list of contents. It's best to extract this list into a partial.
        ```erb
        <%# app/views/dashboard/index.html.erb %>
        <%# ... form from previous guide ... %>

        <h2>My Content</h2>
        <div id="contents">
          <%= render @contents %>
        </div>
        ```
3.  **Create the Content Partial:**
    *   Create a file `app/views/contents/_content.html.erb`. Rails will automatically use this partial to render each object in the `@contents` collection.
    *   The `dom_id` helper is crucial here as it creates a unique ID for the Turbo Stream to target.
        ```erb
        <%# app/views/contents/_content.html.erb %>
        <%= tag.div id: dom_id(content), class: "content-item" do %>
          <p>
            <strong>Status:</strong>
            <span class="status-badge"><%= content.status %></span>
          </p>
          <p><%= truncate(content.raw_content, length: 100) %></p>
          <%= link_to "View Content", content_path(content) %>
        <% end %>
        ```

**Part 2: Real-time Updates with Turbo Streams**

1.  **Broadcast from the Model:**
    *   The easiest way to send Turbo Stream updates is directly from the model using callbacks.
    *   Update `app/models/content.rb` to broadcast changes.
        ```ruby
        # app/models/content.rb
        class Content < ApplicationRecord
          belongs_to :user
          # This will broadcast updates on create, update, and destroy
          # to a stream named after the user (e.g., "user_1_contents").
          broadcasts_to ->(content) { [content.user, "contents"] }, inserts_by: :prepend
        end
        ```
    *   When the background job calls `content.update(status: '...')`, this callback will automatically fire.
2.  **Subscribe on the Dashboard:**
    *   In the dashboard view, add a `turbo_stream_from` tag to subscribe to the broadcast.
        ```erb
        <%# app/views/dashboard/index.html.erb %>
        <%= turbo_stream_from Current.user, "contents" %>

        <h2>My Content</h2>
        <div id="contents">
          <%= render @contents %>
        </div>
        ```
    *   Now, whenever a `Content` record owned by the `current_user` is created or updated, the server will send a Turbo Stream to the client, which will automatically prepend or replace the corresponding HTML fragment in the `#contents` div.

**Part 3: Content Viewer Page**

1.  **Create Controller Action:**
    *   The `ContentsController` should have a `show` action.
        ```ruby
        # app/controllers/contents_controller.rb
        def show
          @content = Current.user.contents.find(params[:id])
        end
        ```
2.  **Create View:**
    *   Create the view file `app/views/contents/show.html.erb`.
    *   For now, just display the `raw_content`.
        ```erb
        <%# app/views/contents/show.html.erb %>
        <h1>Content Viewer</h1>
        <p><strong>Status:</strong> <%= @content.status %></p>
        <hr>
        <pre><%= @content.raw_content %></pre>
        <hr>
        <%= link_to "Back to Dashboard", dashboard_path %>
        ```

**Testing:**
*   Log in and go to the dashboard. You should see an empty list initially.
*   Submit a new piece of content. The new item should immediately appear in your list with a "pending" status (thanks to the `broadcasts_to` on create).
*   Watch the list. Without any page refresh, you should see the item's status badge change from "pending" to "processing" and then to "ready".
*   Click the "View Content" link.
*   You should be taken to the `/contents/[id]` page and see the full raw content.
