As a senior Rails developer, your task is to implement user authentication for the `buildyourownphd` project using **Devise** following Speedrail conventions. This is the foundational step for securing the application.

**Context:**
The project is a Rails 8 application built using the Speedrail template. We will use Devise gem (Speedrail default) which provides a comprehensive authentication solution with email/password authentication and PostgreSQL for the database.

**Acceptance Criteria:**
1.  Users can sign up for a new account.
2.  Users can log in with their email and password.
3.  Users can log out.
4.  Users can reset their passwords via email.
5.  A specific route (e.g., `/dashboard`) is protected and only accessible to logged-in users.
6.  Application-wide controllers are protected by default, requiring authentication for all actions unless explicitly skipped.

**Implementation Steps:**

**Part 1: Devise Setup**

1.  **Add Devise to Gemfile:**
    *   Devise should already be included in Speedrail template, but verify in `Gemfile`:
    ```ruby
    gem 'devise'
    ```

2.  **Generate Devise Configuration:**
    *   Run the Devise generator: `bundle exec rails generate devise:install`.
    *   This creates the Devise initializer and provides setup instructions.

3.  **Configure Devise Initializer:**
    *   Review and configure `config/initializers/devise.rb` for your application needs.
    *   Set your application's secret key and mailer sender email.

4.  **Generate User Model:**
    *   Generate the Devise User model: `bundle exec rails generate devise User`.
    *   This creates the User model with Devise modules and migration.

5.  **Run Migration:**
    *   Run the migration to create the users table: `rails db:migrate`.
    *   The generated migration includes email, encrypted_password, and additional Devise fields.

**Part 2: User Model Configuration**

1.  **Review Generated User Model:**
    *   The User model (`app/models/user.rb`) includes these Devise modules:
    ```ruby
    class User < ApplicationRecord
      devise :database_authenticatable, :registerable,
             :recoverable, :rememberable, :validatable
    end
    ```

2.  **Add Admin Flag (Speedrail Convention):**
    *   Add admin boolean field for Active Admin access:
    ```bash
    rails generate migration AddAdminToUsers admin:boolean
    rails db:migrate
    ```
    *   Update User model:
    ```ruby
    class User < ApplicationRecord
      devise :database_authenticatable, :registerable,
             :recoverable, :rememberable, :validatable
             
      # Speedrail convention for admin access
      def admin?
        admin == true
      end
    end
    ```

**Part 3: Protecting Routes**

1.  **Protect Application Controller:**
    *   Add authentication requirement to `ApplicationController`:
    ```ruby
    # app/controllers/application_controller.rb
    class ApplicationController < ActionController::Base
      before_action :authenticate_user!
      
      # Speedrail convention - protect from forgery
      protect_from_forgery with: :exception
    end
    ```
    *   This ensures every action requires a logged-in user using Devise's `authenticate_user!` method.

2.  **Skipping Authentication for Public Controllers:**
    *   For controllers that should be public (e.g., landing pages), skip authentication:
    ```ruby
    # app/controllers/pages_controller.rb
    class PagesController < ApplicationController
      skip_before_action :authenticate_user!, only: [:index, :about]
    
      def index
        # Landing page logic
      end
      
      def about
        # About page logic
      end
    end
    ```

3.  **Set Up Protected Dashboard:**
    *   Create a dashboard controller: `rails g controller Dashboard index`.
    *   Since `ApplicationController` has `authenticate_user!`, the dashboard is automatically protected.
    *   Add route to `config/routes.rb`: `get '/dashboard', to: 'dashboard#index'`.

**Part 4: Customize Devise Views (Optional)**

1.  **Generate Devise Views:**
    *   Generate customizable views: `bundle exec rails generate devise:views`.
    *   This creates views in `app/views/devise/` for login, signup, password reset, etc.

2.  **Style with Tailwind (Speedrail Convention):**
    *   Customize the generated views with Tailwind CSS classes to match your design.
    *   Key views to customize:
        *   `devise/sessions/new.html.erb` - Login form
        *   `devise/registrations/new.html.erb` - Signup form
        *   `devise/passwords/new.html.erb` - Password reset request

**Part 5: UI and User Flow**

1.  **Add Authentication Links to Layout:**
    *   In your main layout (`app/views/layouts/application.html.erb`), add authentication links using Devise helpers:
    ```erb
    <% if user_signed_in? %>
      <p>Welcome, <%= current_user.email %>!</p>
      <%= link_to "Dashboard", dashboard_path, class: "text-blue-600" %>
      <%= link_to "Log out", destroy_user_session_path, method: :delete, 
                  data: { confirm: "Are you sure?" }, class: "text-red-600" %>
    <% else %>
      <%= link_to "Sign up", new_user_registration_path, class: "text-blue-600" %>
      <%= link_to "Log in", new_user_session_path, class: "text-blue-600" %>
    <% end %>
    ```

2.  **Configure Routes:**
    *   Devise automatically adds routes. Verify in `config/routes.rb` that you have:
    ```ruby
    devise_for :users
    ```

**Part 6: Email Configuration (For Password Reset)**

1.  **Configure Action Mailer:**
    *   In `config/environments/development.rb`, add:
    ```ruby
    config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }
    config.action_mailer.delivery_method = :letter_opener
    ```
    *   Add `gem 'letter_opener'` to development group in Gemfile for email preview.

**Testing:**
*   Manually test the complete authentication flow:
    *   Sign up for a new account
    *   Log in with email and password
    *   Try to access `/dashboard` while logged out (should redirect to login)
    *   Log in and verify dashboard access
    *   Test password reset functionality
    *   Log out and verify you're signed out
*   Write system tests using RSpec and Capybara:
    ```ruby
    # spec/system/authentication_spec.rb
    require 'rails_helper'
    
    RSpec.describe 'Authentication', type: :system do
      it 'allows user to sign up and log in' do
        visit new_user_registration_path
        # Test signup flow...
      end
    end
    ```

**Admin Setup (Speedrail Convention):**
*   Set the first user as admin via Rails console:
    ```ruby
    User.first.update!(admin: true)
    ```
*   This allows access to Active Admin panel at `/admin`.

**Key Devise Helpers:**
*   `current_user` - Returns the currently signed-in user
*   `user_signed_in?` - Returns true if a user is signed in
*   `authenticate_user!` - Before action to require authentication
*   `sign_in(user)` - Programmatically sign in a user
*   `sign_out(user)` - Programmatically sign out a user
