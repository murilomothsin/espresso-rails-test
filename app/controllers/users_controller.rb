# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :authorize, only: %i[index update]

  def index
    @users = current_company.users
    respond_to do |format|
      format.html { render :index }
      format.json { render json: @users, status: :ok }
    end
  end

  def new; end

  def create
    if current_user&.user?
      return render json: { errors: 'Permissão inválida' },
                    status: :unprocessable_entity
    end

    ActiveRecord::Base.transaction do
      build_company
      @user = @company.users.new(user_params.merge(role: @role))
      if @company.save && @user.save
        render json: { data: @user }, status: :created
      else
        render json: { errors: { user: @user.errors.full_messages, company: @company.errors.full_messages } },
               status: :unprocessable_entity
      end
    end
  end

  def update
    @user = current_company.users.find(params[:id])
    if @user.update(user_params)
      render json: { data: @user }, status: :created
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { errors: 'User not found' }, status: :not_found
  end

  private

  def build_company
    if params[:company].blank? && current_company.present?
      @company = current_user.company
      @role = :user
    else
      @company = Company.new(company_params)
      @role = :admin
    end
  end

  def user_params
    # strong parameters - whitelist of allowed fields #=> permit(:name, :email, ...)
    # that can be submitted by a form to the user model #=> require(:user)
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end

  def company_params
    # strong parameters - whitelist of allowed fields #=> permit(:name, :email, ...)
    # that can be submitted by a form to the user model #=> require(:user)
    params.require(:company).permit(:name, :cnpj)
  end
end
