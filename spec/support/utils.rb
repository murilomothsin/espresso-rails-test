# frozen_string_literal: true

def sign_in(user)
  headers = { 'CONTENT_TYPE' => 'application/json' }
  params = { email: user.email, password: user.password }
  post '/login', params: params.to_json, headers: headers
end

def build_statement_payload(last4)
  {
    merchant: 'Uber *UBER *TRIP',
    cost: 1780,
    created_at: 3.days.ago,
    last4: last4,
    transaction_id: '3e85a730-bb1f-451b-9a39-47c55aa054db'
  }
end
