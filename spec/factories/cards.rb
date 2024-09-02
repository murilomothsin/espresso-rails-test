FactoryBot.define do
  factory :card do
    last4 { "MyString" }
    user { nil }
  end
end
