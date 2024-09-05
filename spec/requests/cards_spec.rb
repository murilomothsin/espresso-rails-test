# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Cards', type: :request do
  let(:company) { Company.create(name: 'asd', cnpj: '123') }
  let!(:user) { User.create(name: 'asd', email: 'asd@asd.com', password: '123456', company: company, role: :admin) }
  describe 'GET /index' do
    before(:each) do
      sign_in(user)
    end
    it "returns cards collection" do
      get '/cards.json'

      expect(response.status).to eq(200)
      expect(JSON.parse(response.body)).to include("cards")
      expect(JSON.parse(response.body)).to include("users")
    end
  end

  describe 'POST /create' do
    before(:each) do
      sign_in(user)
    end
    it 'returns http success when valid' do
      post cards_path, params: {
        card: {
          last4: '1234',
          user_id: user.id
        }
      }

      expect(response).to have_http_status(:success)
      expect(Card.last.last4).to eq('1234')
    end

    it 'returns http error when invalid' do
      post cards_path, params: {
        card: {
          user_id: user.id
        }
      }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe 'GET /update' do
    before(:each) do
      sign_in(user)
    end
    it 'returns http success' do
      card = FactoryBot.create(:card)
      put card_path(card.id), params: {
        card: { last4: '1111' }
      }

      expect(response).to have_http_status(:success)
      expect(JSON.parse(response.body)['last4']).not_to eq(card.last4)
    end

    it 'fails with invalid data' do
      card = FactoryBot.create(:card)
      card2 = FactoryBot.create(:card)
      put card_path(card.id), params: {
        card: { last4: card2.last4 }
      }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end
