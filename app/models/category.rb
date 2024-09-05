# frozen_string_literal: true

class Category < ApplicationRecord
  belongs_to :company

  validates :name, presence: true
end
