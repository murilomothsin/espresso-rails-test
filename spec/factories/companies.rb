# frozen_string_literal: true

FactoryBot.define do
  factory :company do
    name { FFaker::Company.name }
    cnpj { FFaker::IdentificationBR.pretty_cnpj }
  end
end
