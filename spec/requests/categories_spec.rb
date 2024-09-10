# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Categories' do
  let(:company) { Company.create(name: 'asd', cnpj: '123') }
  let!(:user) { User.create(name: 'asd', email: 'asd@asd.com', password: '123456', company: company, role: :admin) }
  let!(:category) { FactoryBot.create(:category, company: company) }
  let!(:category_outside_company) { FactoryBot.create(:category) }

  describe 'GET /index' do
    before do
      sign_in(user)
    end

    it 'returns categories collection from the company' do
      get '/categories.json'

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body.size).to eq(1)
      expect(response.parsed_body.pluck('id')).to include(category.id)
      expect(response.parsed_body.pluck('id')).not_to include(category_outside_company.id)
    end
  end

  describe 'POST /create' do
    before do
      sign_in(user)
    end

    it 'returns http success when valid' do
      post categories_path, params: {
        category: { name: 'Test' }
      }

      expect(response).to have_http_status(:success)
      expect(Category.last.name).to eq('Test')
    end

    it 'returns http error when invalid' do
      post categories_path, params: {
        category: { name: '' }
      }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end
