class UsersController < ApplicationController
  before_action :authorize, only: [:index, :update]

  def new
  end

  def create
    ActiveRecord::Base.transaction do
      if params[:company].blank? && current_company.present?
        @company = current_user.company
        role = :user
      else
        @company = Company.new(company_params)
        role = :admin
      end
      @user = @company.users.new(user_params)
      @user.role = role
      @user.email.downcase!

      if @company.save && @user.save
        render json: { data: @user }, status: :created
      else
        render json: { errors: { user: @user.errors.full_messages, company: @company.errors.full_messages} }, status: :unprocessable_entity
      end
    end
  end

  def index
    @users = current_company.users
    respond_to do |format|
      format.html { render :index }
      format.json { render json: @users, status: :ok }
    end
  end

  def update
    @user = User.find(params[:id])
    if @user.update(user_params)
      render json: { data: @user }, status: :created
    else
      render json: { errors:  @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

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
