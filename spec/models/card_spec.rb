# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Card do
  describe 'associations' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to have_many(:statements) }
  end

  describe 'validations' do
    subject { FactoryBot.build(:card) }

    it { is_expected.to validate_presence_of(:last4) }
    it { is_expected.to validate_uniqueness_of(:last4).case_insensitive }
  end
end
