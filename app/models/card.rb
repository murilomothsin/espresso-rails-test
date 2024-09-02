# frozen_string_literal: true

class Card < ApplicationRecord
  belongs_to :user
  has_many :statements, dependent: :destroy
end
