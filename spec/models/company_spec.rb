# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Company do
  describe 'associations' do
    it { is_expected.to have_many(:users) }
    it { is_expected.to have_many(:categories) }
    it { is_expected.to have_many(:cards) }
    it { is_expected.to have_many(:statements) }
  end

  describe 'validations' do
    subject { FactoryBot.build(:company) }

    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_presence_of(:cnpj) }
  end
end
