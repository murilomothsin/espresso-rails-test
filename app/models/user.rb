# frozen_string_literal: true

require 'securerandom'

class User < ApplicationRecord
  has_secure_password
  belongs_to :company
  has_many :cards, dependent: :nullify
  has_many :statements, through: :cards
  validates :email, presence: true
  validates :password, confirmation: true

  before_save { self.email = email.downcase }
  before_validation :set_password, if: ->(user) { user.password.blank? }
  after_save { UserMailer.with(user: self, password: @password).welcome_email.deliver_later }

  enum role: { user: 0, admin: 1 }

  private

  def set_password
    @password = SecureRandom.hex(4)
    self.password = @password
  end
end
