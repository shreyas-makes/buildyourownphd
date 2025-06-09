As a senior backend developer, your task is to create the initial content processing pipeline in the Rails application. This involves creating a new database table, updating the controller to receive content, and setting up a background job to process it.

**Context:**
This task connects the frontend submission form to the backend. The `ContentsController#create` action will now not only save the content but also enqueue a background job for processing. For this initial task, "processing" will just be a simulated delay.

**Acceptance Criteria:**
1.  A `contents` table exists with the correct schema to store submitted content.
2.  The `ContentsController#create` action receives and validates new content submissions.
3.  The endpoint is protected and requires a logged-in user (handled by `ApplicationController`).
4.  Submitted content is saved to the `contents` table with a `pending` status.
5.  A background job queue (Sidekiq with Redis) is set up.
6.  A job is added to the queue when new content is saved.
7.  A job processor handles jobs from the queue, simulates work, and updates the content's status to `ready`.

**Implementation Steps:**

**Part 1: Database Setup (Rails Migration)**

1.  **Create `contents` Table Migration:**
    *   Generate a migration to create the `contents` table.
        ```bash
        rails g model Content user:references content_type:string raw_content:text status:string
        ```
    *   This creates the model file `app/models/content.rb` and a migration file.
    *   Modify the migration to add a default value for the `status` column.
        ```ruby
        # db/migrate/xxxxxxxxxx_create_contents.rb
        class CreateContents < ActiveRecord::Migration[7.1]
          def change
            create_table :contents do |t|
              t.references :user, null: false, foreign_key: true
              t.string :content_type
              t.text :raw_content
              t.string :status, default: 'pending' # Add default value

              t.timestamps
            end
          end
        end
        ```
    *   Run the migration: `rails db:migrate`.
2.  **Model Association:**
    *   Ensure the `User` model has the correct association:
        ```ruby
        # app/models/user.rb
        has_many :contents
        ```

**Part 2: Backend Content Logic**

1.  **Install Dependencies:**
    *   Add `gem 'sidekiq'` to your `Gemfile` and run `bundle install`.
    *   Follow the basic Sidekiq setup instructions (e.g., creating `config/sidekiq.yml`).
    *   Set your ActiveJob adapter in `config/application.rb`: `config.active_job.queue_adapter = :sidekiq`.
2.  **Update Content Controller (`contents_controller.rb`):**
    *   Modify the `create` action to enqueue the processing job after a successful save.
        ```ruby
        # app/controllers/contents_controller.rb
        def create
          @content = Current.user.contents.build(content_params)
          if @content.save
            ContentProcessingJob.perform_later(@content.id)
            redirect_to dashboard_path, notice: "Content submitted and is now being processed."
          else
            # Handle validation errors
            render 'dashboard/index', status: :unprocessable_entity
          end
        end
        ```
    *   Ensure your `content_params` are correctly defined as in the previous guide.

**Part 3: Background Processor (ActiveJob)**

1.  **Create Job:**
    *   Generate a new ActiveJob: `rails g job ContentProcessing`.
    *   This creates `app/jobs/content_processing_job.rb`.
2.  **Implement Job Logic:**
    *   The job will receive the `content_id` as an argument.
    *   It finds the content, simulates work, and updates the status.
        ```ruby
        # app/jobs/content_processing_job.rb
        class ContentProcessingJob < ApplicationJob
          queue_as :default

          def perform(content_id)
            content = Content.find_by(id: content_id)
            return unless content

            # Update status to 'processing'
            content.update(status: 'processing')

            # Simulate work (e.g., calling an external API)
            sleep 5

            # Update status to 'ready'
            content.update(status: 'ready')

            # (In the next guide, we'll add a Turbo Stream broadcast here)
          rescue => e
            content&.update(status: 'error')
            # Log the error, e.g., Rails.logger.error "..."
            raise e
          end
        end
        ```

**Testing:**
*   Start your Rails server (`rails s`) and your Sidekiq worker (`bundle exec sidekiq`).
*   Submit a new piece of content via the dashboard form.
*   You should be redirected to the dashboard, and a job should appear in your Sidekiq logs/dashboard.
*   Check your `contents` table in the database (`rails c` -> `Content.last`). You should see the new record with `status: 'pending'` initially, then `'processing'`, and finally `'ready'`.
*   Write a unit test for the `ContentProcessingJob` to ensure it correctly updates the content's status.
