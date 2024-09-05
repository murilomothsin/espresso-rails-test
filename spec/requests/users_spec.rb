# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Users' do
  let(:company) { Company.create(name: 'asd', cnpj: '123') }
  let!(:user) { User.create(name: 'asd', email: 'asd@asd.com', password: '123456', company: company, role: :admin) }
  let!(:another_user) { FactoryBot.create(:user) }

  describe 'GET /index' do
    before(:each) do
      sign_in(user)
    end
    it "returns users collection" do
      get '/users.json'

      expect(response.status).to eq(200)
      expect(JSON.parse(response.body).size).to eq(1)
      expect(JSON.parse(response.body).first['id']).to eq(user.id)
    end
  end

  describe 'POST /create' do
    context 'when unsigned user tries to create a new account' do
      it 'creates an :admin user' do
        post users_path, params: {
          user: {
            name: 'Test',
            email: 'email@email.com',
            password: '123456'
          },
          company: {
            name: 'Test Company',
            cnpj: '11.111.111/0001-11'
          }
        }
  
        expect(response).to have_http_status(:success)
        expect(User.last.admin?).to be true
      end

      it 'fails with invalid data' do
        post users_path, params: {
          user: {
            name: 'Test',
            password: '123456'
          },
          company: {
            name: 'Test Company',
            cnpj: '11.111.111/0001-11'
          }
        }
  
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'when signed admin user tries to create a new user' do
      before(:each) do
        sign_in(user)
      end
      it 'creates an :user' do
        post users_path, params: {
          user: {
            name: 'Test',
            email: 'email@email.com',
            password: '123456'
          }
        }
  
        expect(response).to have_http_status(:success)
        expect(User.last.admin?).to be false
      end
    end

    context 'when signed regular user tries to create a new user' do
      let(:non_admin_user) { FactoryBot.create(:user, role: :user, company: company) }
      before(:each) do
        sign_in(non_admin_user)
      end
      it 'raises an error' do
        post users_path, params: {
          user: {
            name: 'Test',
            email: 'email@email.com',
            password: '123456'
          }
        }

        expect(response).to have_http_status(:unprocessable_entity)
        expect(User.last.id).to eq(non_admin_user.id)
      end
    end

    describe 'GET /update' do
      before(:each) do
        sign_in(user)
      end
      context 'when updating a user in the same company' do
        it 'returns http success' do
          user = FactoryBot.create(:user, company: company)
          put user_path(user.id), params: {
            user: { name: 'New Name' }
          }
    
          expect(response).to have_http_status(:success)
          expect(JSON.parse(response.body)['name']).not_to eq(user.name)
        end

        it 'fails with invalid data' do
          user = FactoryBot.create(:user, company: company)
          put user_path(user.id), params: {
            user: { email: '' }
          }
    
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end

      context 'when updating a user in a different company' do
        it 'raises an error' do
          user = FactoryBot.create(:user)
          put user_path(user.id), params: {
            user: { name: 'New Name' }
          }

          expect(response).to have_http_status(:not_found)
        end
      end
    end
  end
end
