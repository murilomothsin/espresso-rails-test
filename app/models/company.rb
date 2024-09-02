class Company < ApplicationRecord
  has_many :users
  has_many :categories
  has_many :cards, through: :users
  has_many :statements, through: :cards
  validates_presence_of :name, :cnpj
end
