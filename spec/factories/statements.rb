FactoryBot.define do
  factory :statement do
    performed_at { "2024-08-29 03:08:34" }
    cost { 1 }
    merchant { "MyString" }
    transaction_id { 1 }
    category { nil }
  end
end
