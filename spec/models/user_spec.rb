# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User do
  describe 'associations' do
    it { is_expected.to belong_to(:company) }
    it { is_expected.to have_many(:cards) }
    it { is_expected.to have_many(:statements) }
  end

  describe 'validations' do
    subject { FactoryBot.build(:user) }

    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_uniqueness_of(:email) }
  end

  describe 'secure password' do
    it { is_expected.to have_secure_password }
  end

  describe 'creates a password' do
    let(:user) { FactoryBot.build(:user, password: nil) }

    it 'when no password provided' do
      user.save
      expect(user.password_digest).not_to be_nil
    end
  end

  describe 'sends welcome email' do
    let(:user) { FactoryBot.build(:user) }

    it 'when record is created' do
      expect(UserMailer).to deliver_later(:welcome_email)
      user.save
    end
  end
end
