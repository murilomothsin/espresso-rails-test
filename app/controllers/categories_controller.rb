# frozen_string_literal: true

class CategoriesController < ApplicationController
  before_action :authorize, only: %i[index create]
  def index
    @categories = current_company.categories
    respond_to do |format|
      format.html { render :index }
      format.json { render json: @categories, status: :ok }
    end
  end

  def create
    @category = current_company.categories.new(category_params)

    if @category.save
      render json: { data: @category }, status: :created
    else
      render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def category_params
    params.require(:category).permit(:name)
  end
end
