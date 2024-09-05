# frozen_string_literal: true

class Card < ApplicationRecord
  belongs_to :user
  has_many :statements, dependent: :destroy

  validates :last4, presence: true
  validates :last4, uniqueness: { case_sensitive: false }
end
