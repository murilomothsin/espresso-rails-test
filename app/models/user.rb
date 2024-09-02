# frozen_string_literal: true

require 'securerandom'

class User < ApplicationRecord
  has_secure_password
  belongs_to :company
  has_many :cards, dependent: :nullify
  has_many :statements, through: :cards
  validates :email, presence: true, uniqueness: true
  validates :password, confirmation: true

  before_save { self.email = email.downcase }
  before_validation :set_password, if: ->(user) { user.password.blank? }

  enum role: { user: 0, admin: 1 }

  private

  def set_password
    self.password = SecureRandom.hex(4)
  end
end
