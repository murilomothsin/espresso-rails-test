# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User do
  subject { user }

  let(:user) { FactoryBot.create(:user) }

  describe '#valid?' do
    subject { user.valid? }

    it { is_expected.to be true }
  end
end
