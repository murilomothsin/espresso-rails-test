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
    let!(:other_category) { FactoryBot.create(:category) }

    it "validates category's company" do
      attrs = FactoryBot.attributes_for(:statement, card: card).merge(card_id: card.id)
      statement = described_class.create(attrs)
      statement.update(category_id: other_category.id)
      expect(statement.errors.details).to include(:category)
    end
  end
end
