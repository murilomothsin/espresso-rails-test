# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Statements' do
  let(:company) { Company.create(name: 'asd', cnpj: '123') }
  let!(:user) { User.create(name: 'asd', email: 'asd@asd.com', password: '123456', company: company, role: :admin) }
  let!(:another_user) { FactoryBot.create(:user, company: company) }
  let!(:outside_user) { FactoryBot.create(:user) }

  describe 'GET /index' do
    context 'when admin user' do
      let(:admin_card) { FactoryBot.create(:card, user: user) }
      let(:user_card) { FactoryBot.create(:card, user: another_user) }
      let(:card_from_other_company) { FactoryBot.create(:card, user: outside_user) }
      let!(:admin_statement) { FactoryBot.create(:statement, card: admin_card) }
      let!(:user_statement) { FactoryBot.create(:statement, card: user_card) }
      let!(:statement_from_other_company) { FactoryBot.create(:statement, card: card_from_other_company) }

      before do
        sign_in(user)
      end

      it 'returns all statements collection' do
        get '/statements.json'

        expect(response).to have_http_status(:ok)
        expect(response.parsed_body.size).to eq(2)
        expect(response.parsed_body[0]['id']).to eq(admin_statement.id)
        expect(response.parsed_body[1]['id']).to eq(user_statement.id)
      end

      it 'prevents user from seeing statements from another company' do
        get '/statements.json'

        expect(response).to have_http_status(:ok)
        expect(response.parsed_body.pluck('id')).not_to include(statement_from_other_company.id)
      end
    end

    context 'when regular user' do
      let(:admin_card) { FactoryBot.create(:card, user: user) }
      let(:user_card) { FactoryBot.create(:card, user: another_user) }
      let(:card_from_other_company) { FactoryBot.create(:card, user: outside_user) }
      let!(:admin_statement) { FactoryBot.create(:statement, card: admin_card) }
      let!(:user_statement) { FactoryBot.create(:statement, card: user_card) }
      let!(:statement_from_other_company) { FactoryBot.create(:statement, card: card_from_other_company) }

      before do
        sign_in(another_user)
      end

      it "returns user's statements collection" do
        get '/statements.json'

        expect(response).to have_http_status(:ok)
        expect(response.parsed_body.size).to eq(1)
        expect(response.parsed_body.pluck('id')).to include(user_statement.id)
        expect(response.parsed_body.pluck('id')).not_to include(admin_statement.id)
      end

      it 'prevents user from seeing statements from another company' do
        get '/statements.json'

        expect(response).to have_http_status(:ok)
        expect(response.parsed_body.pluck('id')).not_to include(statement_from_other_company.id)
      end
    end
  end

  describe 'PUT /archive' do
    context 'when admin user' do
      let(:user_card) { FactoryBot.create(:card, user: another_user) }
      let(:card_from_other_company) { FactoryBot.create(:card, user: outside_user) }
      let!(:user_statement) { FactoryBot.create(:statement, card: user_card) }
      let!(:statement_from_other_company) { FactoryBot.create(:statement, card: card_from_other_company) }

      before do
        sign_in(user)
      end

      it 'can archive statements' do
        put archive_statement_path(user_statement)

        expect(response).to have_http_status(:ok)
        expect(response.parsed_body['archived']).to be true
        expect(Statement.find(user_statement.id).archived).to be true
      end

      it 'prevents user from archive statements from another company' do
        put archive_statement_path(statement_from_other_company)

        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when regular user' do
      let(:user_card) { FactoryBot.create(:card, user: another_user) }
      let(:card_from_other_company) { FactoryBot.create(:card, user: outside_user) }
      let!(:user_statement) { FactoryBot.create(:statement, card: user_card) }
      let!(:statement_from_other_company) { FactoryBot.create(:statement, card: card_from_other_company) }

      before do
        sign_in(another_user)
      end

      it "can't archive statements" do
        put archive_statement_path(user_statement)

        expect(response).to have_http_status(:forbidden)
        expect(Statement.find(user_statement.id).archived).to be false
      end

      it 'prevents user from archive statements from another company' do
        put archive_statement_path(statement_from_other_company)

        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'POST /api/baas/webhooks' do
    let(:card1) { FactoryBot.create(:card, user: user, last4: '1234') }
    let(:card_from_other_company) { FactoryBot.create(:card, user: outside_user, last4: '5678') }

    before do
      sign_in(user)
    end

    it 'can create a statement' do
      post api_baas_webhooks_path, params: build_statement_payload(card1.last4)

      expect(response).to have_http_status(:created)
    end

    it 'can create a statement for another company' do
      post api_baas_webhooks_path, params: build_statement_payload(card_from_other_company.last4)

      expect(response).to have_http_status(:created)
    end

    it 'requires a valid last4 credit card' do
      post api_baas_webhooks_path, params: build_statement_payload('9999')

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe 'PUT /update' do
    context 'when admin user' do
      let(:admin_card) { FactoryBot.create(:card, user: user) }
      let(:user_card) { FactoryBot.create(:card, user: another_user) }
      let(:card_from_other_company) { FactoryBot.create(:card, user: outside_user) }
      let!(:admin_statement) { FactoryBot.create(:statement, card: admin_card) }
      let!(:statement_from_other_company) { FactoryBot.create(:statement, card: card_from_other_company) }
      let(:category) { FactoryBot.create(:category, company: company) }
      let(:outside_category) { FactoryBot.create(:category, company: outside_user.company) }

      before do
        sign_in(user)
      end

      it "can update category's statement" do
        put statement_path(admin_statement), params: {
          statement: { category_id: category.id }
        }

        expect(response).to have_http_status(:created)
        expect(response.parsed_body['category_id']).to eq(category.id)
      end

      it "can't update category's statement with invalid category id" do
        put statement_path(admin_statement), params: {
          statement: { category_id: outside_category.id }
        }

        expect(response).to have_http_status(:unprocessable_entity)
      end

      it "can update attachment's statement" do
        file = fixture_file_upload(Rails.public_path.join('apple-touch-icon.png'), 'image/png')
        expect do
          put statement_path(admin_statement), params: { statement: { attachment: file } }
        end.to change(ActiveStorage::Attachment, :count).by(1)
      end

      it 'prevents user from update statements from another company' do
        put statement_path(statement_from_other_company), params: {
          statement: { category_id: category.id }
        }

        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when regular user' do
      let(:admin_card) { FactoryBot.create(:card, user: user) }
      let(:user_card) { FactoryBot.create(:card, user: another_user) }
      let!(:admin_statement) { FactoryBot.create(:statement, card: admin_card) }
      let!(:user_statement) { FactoryBot.create(:statement, card: user_card) }
      let(:category) { FactoryBot.create(:category, company: company) }

      before do
        sign_in(another_user)
      end

      it "can update own category's statement" do
        put statement_path(user_statement), params: {
          statement: { category_id: category.id }
        }

        expect(response).to have_http_status(:created)
        expect(response.parsed_body['category_id']).to eq(category.id)
      end

      it "can update attachment's statement" do
        file = fixture_file_upload(Rails.public_path.join('apple-touch-icon.png'), 'image/png')
        expect do
          put statement_path(user_statement), params: { statement: { attachment: file } }
        end.to change(ActiveStorage::Attachment, :count).by(1)
      end

      it 'prevents user from update statements from another user' do
        put statement_path(admin_statement), params: {
          statement: { category_id: category.id }
        }

        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
