# frozen_string_literal: true

FactoryBot.define do
  factory :card do
    last4 { FFaker::Number.number(digits: 4) }
    user
  end
end
