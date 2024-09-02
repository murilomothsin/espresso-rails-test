class CardsController < ApplicationController
  before_action :authorize, only: [:index, :create, :update]

  def index
    @cards = current_company.cards
    @users = current_company.users
    respond_to do |format|
      format.html { render :index }
      format.json { render json: {cards: @cards, users: @users}, status: :ok }
    end
  end

  def create
    @card = Card.new(card_params)
    if @card.save
      render json: { data: @card }, status: :created
    else
      render json: { errors: @card.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @card = Card.find(params[:id])
    if @card.update(card_params)
      render json: { data: @card }, status: :created
    else
      render json: { errors:  @card.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private
  def card_params
    params.require(:card).permit(:last4, :user_id)
  end
end
