require 'rails_helper'

RSpec.describe User, type: :model do
  subject { user }
  let(:user) { FactoryBot.create(:user) }

  describe '#valid?' do
    subject { user.valid? }

    it { is_expected.to be true }
  end

  describe '#invalid?' do
  end
end
