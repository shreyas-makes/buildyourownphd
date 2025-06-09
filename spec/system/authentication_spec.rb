require 'rails_helper'

RSpec.describe 'Authentication', type: :system do
  let(:user_email) { 'test@example.com' }
  let(:user_password) { 'password123' }

  describe 'User registration' do
    it 'allows a user to sign up' do
      visit new_user_registration_path
      
      fill_in 'user_email', with: user_email
      fill_in 'user_password', with: user_password
      
      click_button 'Sign up'
      
      expect(page).to have_link('Logout')
      expect(page).to have_link('Dashboard')
    end
  end

  describe 'User login' do
    let!(:user) { create(:user, email: user_email, password: user_password) }

    it 'allows a user to sign in' do
      visit new_user_session_path
      
      fill_in 'user_email', with: user_email
      fill_in 'user_password', with: user_password
      
      click_button 'Login'
      
      expect(page).to have_link('Logout')
      expect(page).to have_link('Dashboard')
    end

    it 'shows error for invalid credentials' do
      visit new_user_session_path
      
      fill_in 'user_email', with: user_email
      fill_in 'user_password', with: 'wrongpassword'
      
      click_button 'Login'
      
      expect(page).to have_content('Invalid Email or password')
    end
  end

  describe 'Protected routes' do
    context 'when not logged in' do
      it 'redirects to login page when accessing dashboard' do
        visit dashboard_index_path
        
        expect(current_path).to eq(new_user_session_path)
      end
    end

    context 'when logged in' do
      let!(:user) { create(:user, email: user_email, password: user_password) }
      
      before do
        login(user)
      end

      it 'allows access to dashboard' do
        visit dashboard_index_path
        
        expect(page).to have_current_path(dashboard_index_path)
      end
    end
  end

  describe 'Public routes' do
    it 'allows access to homepage without authentication', :skip_redis do
      visit root_path
      
      expect(page).to have_link('Login')
      expect(page).to have_link('Signup')
    end
  end

  describe 'User logout' do
    let!(:user) { create(:user, email: user_email, password: user_password) }
    
    before do
      login(user)
    end

    it 'logs out the user' do
      visit root_path
      click_link 'Logout'
      
      expect(page).to have_link('Login')
      expect(page).not_to have_link('Logout')
    end
  end
end 