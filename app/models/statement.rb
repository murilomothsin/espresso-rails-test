class Statement < ApplicationRecord
  belongs_to :category, optional: true
  belongs_to :card

  has_one_attached :attachment
end
