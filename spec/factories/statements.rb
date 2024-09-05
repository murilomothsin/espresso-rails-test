# frozen_string_literal: true

FactoryBot.define do
  factory :statement do
    performed_at { FFaker::Time.datetime(year_ranhe: 1) }
    cost { FFaker::Number.number(digits: 4) }
    merchant { FFaker::Company.name }
    transaction_id { FFaker::Number.number(digits: 6) }
    category { create(:category, company: card.user.company) }
    card
  end
end
