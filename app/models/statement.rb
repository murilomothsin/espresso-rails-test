# frozen_string_literal: true

class Statement < ApplicationRecord
  belongs_to :category, optional: true
  belongs_to :card

  has_one_attached :attachment

  validate :category_belongs_to_company

  private

  def category_belongs_to_company
    return unless category.present? && (category.company_id != card.user.company_id)

    errors.add(:category, "must belongs to card's company")
  end
end
