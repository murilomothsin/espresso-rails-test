# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Sessions', type: :request do
  describe 'GET /login' do
    it "renders login page" do
      expect { get "/login" }.to_not raise_error
    end
  end

  describe 'POST /login' do
    let(:company) { Company.create(name: 'asd', cnpj: '123') }
    let(:user) { User.create(name: 'asd', email: 'asd@asd.com', password: '123456', company: company, role: :admin) }
    it "authenticate with correct credentials" do
      headers = { "CONTENT_TYPE" => "application/json" }
      post "/login", :params => { email: user.email, password: user.password }.to_json, :headers => headers

      expect(response.status).to eq(200)
      expect(response.cookies).to have_key("_espresso_rails_test_session")
    end

    it "fails to authenticate with wrong credential" do
      headers = { "CONTENT_TYPE" => "application/json" }
      post "/login", :params => { email: user.email, password: 'wrongpassword'}.to_json, :headers => headers

      expect(response.status).to eq(401)
      expect(response.cookies).not_to have_key("_espresso_rails_test_session")
    end
  end

  describe 'DELETE /logout' do
    let(:company) { Company.create(name: 'asd', cnpj: '123') }
    let(:user) { User.create(name: 'asd', email: 'asd@asd.com', password: '123456', company: company, role: :admin) }
    before {
      sign_in(user)
    }
    it "destroy user session" do
      
      # logged cookie, it should change after logout
      old_cookie = response.cookies["_espresso_rails_test_session"]
      delete "/logout"

      expect(response.status).to eq(200)
      expect(response.cookies["_espresso_rails_test_session"]).not_to eq(old_cookie)
    end
  end
end
