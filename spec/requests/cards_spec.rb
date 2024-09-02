# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Cards' do
  include Rack::Test::Methods
  before do
    Company.create(name: 'asd', cnpj: '123')
    User.create(name: 'asd', email: 'asd@asd.com', password: '123456', company: Company.last, role: :admin)
    post login_path, :email => 'asd@asd.com', :password => '123456'

  end
  describe 'GET /index' do
    it 'returns http success' do
      get '/cards.json'
      expect(response).to have_http_status(:success)
    end
  end

  describe 'POST /create' do
    it 'returns http success' do
      Company.create(name: 'asd', cnpj: '123')
      User.create(name: 'asd', email: 'asd@asd.com', company: Company.last)
      post cards_path, {
        card: {
          last4: '1234',
          user_id: User.last.id
        }
      }
      expect(response).to have_http_status(:success)
    end
  end

  # describe 'GET /update' do
  #   it 'returns http success' do
  #     get '/cards/update'
  #     expect(response).to have_http_status(:success)
  #   end
  # end
end
