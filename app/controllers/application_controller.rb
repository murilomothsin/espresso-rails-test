# frozen_string_literal: true

class ApplicationController < ActionController::Base
  skip_before_action :verify_authenticity_token

  helper_method :current_user, :current_company

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end

  def current_company
    @current_company = Company.find(current_user.company_id)
  end

  def authorize
    return redirect_to login_path, alert: 'You must be logged in to access this page.' if  current_user.nil?
    allowed_controllers = ['statements']
    if current_user.user?
      redirect_to login_path, alert: 'Sem permissão.' if !allowed_controllers.include?(params[:controller])
      redirect_to login_path, alert: 'Sem permissão.' if (params[:action] == 'archive')
    end
  end
end
