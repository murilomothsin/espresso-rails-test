require 'securerandom'

class User < ApplicationRecord
  has_secure_password
  belongs_to :company
  has_many :cards
  validates :email, presence: true, uniqueness: true
  validates_confirmation_of :password

  before_save { self.email = email.downcase }
  before_validation :set_password, if: ->(user) { user.password.blank? }

  enum role: [ :user, :admin ]

  private
  def set_password
    self.password = SecureRandom.hex(4)
  end

end
