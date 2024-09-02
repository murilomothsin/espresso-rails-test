# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    name { FFaker::Name.name }
    email { FFaker::Internet.email }
    password { '123456' }
    password_digest { 'MyString' }
    traits_for_enum :role, %i[user admin]
    company
  end
end
