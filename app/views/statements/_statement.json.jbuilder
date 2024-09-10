# frozen_string_literal: true

json.extract! statement, :id, :performed_at, :cost, :merchant, :transaction_id, :category_id, :card_id, :archived,
              :created_at, :updated_at

json.has_attachment statement.attachment.attached?

json.card do
  json.id statement.card.id
  json.last4 statement.card.last4
end

json.user do
  json.id statement.card.user_id
  json.name statement.card.user.name
end

json.category do
  unless statement.category_id.nil?
    json.id statement.category.id
    json.name statement.category.name
  end
end
