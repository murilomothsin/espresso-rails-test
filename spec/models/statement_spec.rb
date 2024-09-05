# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Statement do
  describe 'associations' do
    it { is_expected.to belong_to(:category).optional }
    it { is_expected.to belong_to(:card) }
    it { is_expected.to have_one_attached(:attachment) }
  end

  describe 'validations' do
    let!(:user) { FactoryBot.create(:user) }
    let(:company) { user.company }
    let!(:card) { FactoryBot.create(:card, user: user) }
    let!(:category) { FactoryBot.create(:category, company: company) }
    let!(:other_category) { FactoryBot.create(:category) }

    it "validates category's company" do
      statement = described_class.create(
        merchant: 'Uber *UBER *TRIP',
        cost: 1570,
        created_at: 3.days.ago,
        card_id: card.id,
        transaction_id: '3e85a730-bb1f-451b-9a39-47c55aa054db'
      )
      statement.update(category_id: other_category.id)
      expect(statement.errors.details).to include(:category)
    end
  end
end
