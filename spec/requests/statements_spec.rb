require 'rails_helper'

RSpec.describe "Statements", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/statements/index"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /create" do
    it "returns http success" do
      get "/statements/create"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /update" do
    it "returns http success" do
      get "/statements/update"
      expect(response).to have_http_status(:success)
    end
  end

end
