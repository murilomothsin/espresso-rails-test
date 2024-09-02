# frozen_string_literal: true

class Company < ApplicationRecord
  has_many :users, dependent: :destroy
  has_many :categories, dependent: :destroy
  has_many :cards, through: :users
  has_many :statements, through: :cards
  validates :name, :cnpj, presence: true
end
