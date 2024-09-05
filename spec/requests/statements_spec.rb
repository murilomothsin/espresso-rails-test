# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Statements' do
  let(:company) { Company.create(name: 'asd', cnpj: '123') }
  let!(:user) { User.create(name: 'asd', email: 'asd@asd.com', password: '123456', company: company, role: :admin) }
  let!(:another_user) { FactoryBot.create(:user, company: company) }
  let!(:outside_user) { FactoryBot.create(:user) }

  describe 'GET /index' do
    context 'Admin user' do
      let(:card1) { FactoryBot.create(:card, user: user ) }
      let(:card2) { FactoryBot.create(:card, user: another_user ) }
      let(:card_from_other_company) { FactoryBot.create(:card, user: outside_user ) }
      let!(:statement1) { FactoryBot.create(:statement, card: card1 ) }
      let!(:statement2) { FactoryBot.create(:statement, card: card2 ) }
      let!(:statement_from_other_company) { FactoryBot.create(:statement, card: card_from_other_company ) }
      before(:each) do
        sign_in(user)
      end
      it "returns all statements collection" do
        get '/statements.json'

        expect(response.status).to eq(200)
        expect(JSON.parse(response.body).size).to eq(2)
        expect(JSON.parse(response.body)[0]['id']).to eq(statement1.id)
        expect(JSON.parse(response.body)[1]['id']).to eq(statement2.id)
      end

      it "prevents user from seeing statements from another company" do
        get '/statements.json'

        expect(response.status).to eq(200)
        expect(JSON.parse(response.body).map{|s| s["id"]}).not_to include(statement_from_other_company.id)
      end
    end

    context 'Regular user' do
      let(:card1) { FactoryBot.create(:card, user: user ) }
      let(:card2) { FactoryBot.create(:card, user: another_user ) }
      let(:card_from_other_company) { FactoryBot.create(:card, user: outside_user ) }
      let!(:statement1) { FactoryBot.create(:statement, card: card1 ) }
      let!(:statement2) { FactoryBot.create(:statement, card: card2 ) }
      let!(:statement_from_other_company) { FactoryBot.create(:statement, card: card_from_other_company ) }
      before(:each) do
        sign_in(another_user)
      end
      it "returns user's statements collection" do
        get '/statements.json'

        expect(response.status).to eq(200)
        expect(JSON.parse(response.body).size).to eq(1)
        expect(JSON.parse(response.body)[0]['id']).to eq(statement2.id)
      end

      it "prevents user from seeing statements from another company" do
        get '/statements.json'

        expect(response.status).to eq(200)
        expect(JSON.parse(response.body).map{|s| s["id"]}).not_to include(statement_from_other_company.id)
      end
    end
  end

  describe 'PUT /archive' do
    context 'Admin user' do
      let(:card1) { FactoryBot.create(:card, user: user ) }
      let(:card2) { FactoryBot.create(:card, user: another_user ) }
      let(:card_from_other_company) { FactoryBot.create(:card, user: outside_user ) }
      let!(:statement1) { FactoryBot.create(:statement, card: card1 ) }
      let!(:statement2) { FactoryBot.create(:statement, card: card2 ) }
      let!(:statement_from_other_company) { FactoryBot.create(:statement, card: card_from_other_company ) }
      before(:each) do
        sign_in(user)
      end
      it "can archive statements" do
        put archive_statement_path(statement2)

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['archived']).to be true
        expect(Statement.find(statement2.id).archived).to be true
      end

      it "prevents user from archive statements from another company" do
        put archive_statement_path(statement_from_other_company)

        expect(response).to have_http_status(:not_found)
      end
    end

    context 'Regular user' do
      let(:card1) { FactoryBot.create(:card, user: user ) }
      let(:card2) { FactoryBot.create(:card, user: another_user ) }
      let(:card_from_other_company) { FactoryBot.create(:card, user: outside_user ) }
      let!(:statement1) { FactoryBot.create(:statement, card: card1 ) }
      let!(:statement2) { FactoryBot.create(:statement, card: card2 ) }
      let!(:statement_from_other_company) { FactoryBot.create(:statement, card: card_from_other_company ) }
      before(:each) do
        sign_in(another_user)
      end
      it "can't archive statements" do
        put archive_statement_path(statement2)

        expect(response).to have_http_status(:found) # status found so the user is redirected to login_page
        #TODO: Add a better path for blocking user's action
        expect(Statement.find(statement2.id).archived).to be false
      end

      it "prevents user from archive statements from another company" do
        put archive_statement_path(statement_from_other_company)

        expect(response).to have_http_status(:found) # status found so the user is redirected to login_page
        #TODO: Add a better path for blocking user's action
      end
    end
  end

  describe 'POST /api/baas/webhooks' do
    context 'webhook' do
      let(:card1) { FactoryBot.create(:card, user: user, last4: '1234' ) }
      let(:card_from_other_company) { FactoryBot.create(:card, user: outside_user, card: '5678' ) }
      before(:each) do
        sign_in(user)
      end
      it "can create a statement" do
        post api_baas_webhooks_path, params: {
          merchant: "Uber *UBER *TRIP",
          cost: 1780,
          created_at: 3.days.ago,
          last4: card1.last4,
          transaction_id: "3e85a730-bb1f-451b-9a39-47c55aa054db"
        }

        expect(response).to have_http_status(:created)
      end

      it "can create a statement for another company" do
        post api_baas_webhooks_path, params: {
          merchant: "Uber *UBER *TRIP",
          cost: 1570,
          created_at: 3.days.ago,
          last4: card1.last4,
          transaction_id: "3e85a730-bb1f-451b-9a39-47c55aa054db"
        }

        expect(response).to have_http_status(:created)
      end

      it "requires a valid last4 credit card" do
        post api_baas_webhooks_path, params: {
          merchant: "Uber *UBER *TRIP",
          cost: 1570,
          created_at: 3.days.ago,
          last4: '9999',
          transaction_id: "3e85a730-bb1f-451b-9a39-47c55aa054db"
        }

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'PUT /update' do
    context 'Admin user' do
      let(:card1) { FactoryBot.create(:card, user: user ) }
      let(:card2) { FactoryBot.create(:card, user: another_user ) }
      let(:card_from_other_company) { FactoryBot.create(:card, user: outside_user ) }
      let!(:statement1) { FactoryBot.create(:statement, card: card1 ) }
      let!(:statement_from_other_company) { FactoryBot.create(:statement, card: card_from_other_company ) }
      let(:category) { FactoryBot.create(:category, company: company) }
      let(:category2) { FactoryBot.create(:category, company: outside_user.company) }
      before(:each) do
        sign_in(user)
      end
      it "can update category's statement" do
        put statement_path(statement1), params: {
          statement: {
            category_id: category.id
          }
        }

        expect(response).to have_http_status(:created)
        expect(JSON.parse(response.body)['category_id']).to eq(category.id)
      end

      it "can't update category's statement with invalid category id" do
        put statement_path(statement1), params: {
          statement: {
            category_id: category2.id
          }
        }

        expect(response).to have_http_status(:unprocessable_entity)
        # expect(JSON.parse(response.body)['category_id']).to eq(category.id)
      end

      it "can update attachment's statement" do
        file = fixture_file_upload(Rails.root.join('public', 'apple-touch-icon.png'), 'image/png')
        expect {
          put statement_path(statement1), params: { statement: { attachment: file } }
        }.to change(ActiveStorage::Attachment, :count).by(1)
      end

      it "prevents user from update statements from another company" do
        put statement_path(statement_from_other_company), params: {
          statement: {
            category_id: category.id
          }
        }

        expect(response).to have_http_status(:not_found)
      end
    end

    context 'Regular user' do
      let(:card1) { FactoryBot.create(:card, user: user ) }
      let(:card2) { FactoryBot.create(:card, user: another_user ) }
      let(:card_from_other_company) { FactoryBot.create(:card, user: outside_user ) }
      let!(:statement1) { FactoryBot.create(:statement, card: card1 ) }
      let!(:statement2) { FactoryBot.create(:statement, card: card2 ) }
      let!(:statement_from_other_company) { FactoryBot.create(:statement, card: card_from_other_company ) }
      let(:category) { FactoryBot.create(:category, company: company) }
      before(:each) do
        sign_in(another_user)
      end
      it "can update own category's statement" do
        put statement_path(statement2), params: {
          statement: {
            category_id: category.id
          }
        }

        expect(response).to have_http_status(:created)
        expect(JSON.parse(response.body)['category_id']).to eq(category.id)
      end

      it "can update attachment's statement" do
        file = fixture_file_upload(Rails.root.join('public', 'apple-touch-icon.png'), 'image/png')
        expect {
          put statement_path(statement2), params: { statement: { attachment: file } }
        }.to change(ActiveStorage::Attachment, :count).by(1)
      end

      it "prevents user from update statements from another user" do
        put statement_path(statement1), params: {
          statement: {
            category_id: category.id
          }
        }

        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
