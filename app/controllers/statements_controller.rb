# frozen_string_literal: true

class StatementsController < ApplicationController
  before_action :authorize, only: %i[index update archive]

  def index
    statements_available = current_user.admin? ? current_company.statements : current_user.statements
    @statements = ApplicationController.render(template: 'statements/statements',
                                               assigns: { statements: statements_available })
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
      render json: @statement, status: :created
    else
      render json: { errors: @statement.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def archive
    return render json: { errors: 'Permissão inválida' }, status: :unprocessable_entity if current_user && current_user.user?
    begin
      @statement = current_company.statements.find(params[:id])
      @statement.update(archived: true)
      render json: @statement, status: :ok
    rescue ActiveRecord::RecordNotFound
      render json: { errors: 'Statement not found' }, status: :not_found
    end
  end

  def update
    begin
      @statement = current_user.admin? ? current_company.statements.find(params[:id]) : current_user.statements.find(params[:id])
      if @statement.update(statement_update_params)
        render json:  @statement, status: :created
      else
        render json: { errors: @statement.errors.full_messages }, status: :unprocessable_entity
      end
    rescue ActiveRecord::RecordNotFound
      render json: { errors: 'Statement not found' }, status: :not_found
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
