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
    return redirect_to login_path if current_user.nil?

    allowed_controllers = ['statements']
    return unless current_user.user?

    redirect_to login_path unless allowed_controllers.include?(params[:controller])
  end

  def can_perform?
    return false unless current_user&.user?

    render json: { errors: 'Permissão inválida' },
           status: :forbidden
  end
end
