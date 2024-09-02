class StatementsController < ApplicationController
  before_action :authorize, only: [:index, :update, :archive]

  def index
    @categories = current_company.categories
    @statements = ApplicationController.render(template: 'statements/statements', assigns: { statements: current_company.statements })
    respond_to do |format|
      format.html { render :index }
      format.json { render json: @statements, status: :ok }
    end
  end

  def create
    @card = Card.find_by(last4: params[:last4])
    @statement = Statement.new(statement_params)
    @statement.card = @card
    @statement.performed_at = params[:created_at]

    if @statement.save
      render json: { data: @statement }, status: :created
    else
      render json: { errors:  @statement.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def archive
    @statement = Statement.find(params[:id])
    if @statement.update(archived: true)
      render json: { data: @statement }, status: :created
    else
      render json: { errors:  @statement.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @statement = Statement.find(params[:id])
    if @statement.update(statement_update_params)
      render json: { data: @statement }, status: :created
    else
      render json: { errors:  @statement.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private
  def statement_params
    params.permit(:merchant, :cost, :transaction_id)
  end

  def statement_update_params
    params.require('statement').permit(:attachment, :category_id)
  end
end
