# frozen_string_literal: true

FactoryBot.define do
  factory :category do
    name { FFaker::Color.name }
    company
  end
end
