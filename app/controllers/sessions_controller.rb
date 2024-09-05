# frozen_string_literal: true

class SessionsController < ApplicationController
  def new
  end

  def create
    user = User.find_by(email: params[:email].downcase)

    if user&.authenticate(params[:password])
      # Save the user.id in that user's session cookie:
      session[:user_id] = user.id.to_s
      render json: { data: user }, status: :ok
    else
      render json: { errors: 'Credencial inválida!' }, status: :unauthorized
    end
  end

  def destroy
    # delete the saved user_id key/value from the cookie:
    session.clear
    session.delete(:user_id)
    render json: { data: 'ok' }, status: :ok
  end
end
