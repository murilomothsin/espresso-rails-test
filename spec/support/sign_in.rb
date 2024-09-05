def sign_in(user)
  headers = { "CONTENT_TYPE" => "application/json" }
  params = { email: user.email, password: user.password }
  post "/login", params: params.to_json, headers: headers
end