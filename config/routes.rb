# frozen_string_literal: true

Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'home#index'

  resources :users
  resources :categories, only: [:index, :create]
  resources :cards, only: [:index, :create, :update]
  resources :statements, only: [:index, :update] do
    put '/archive', to: 'statements#archive', on: :member
  end
  post '/api/baas/webhooks', to: 'statements#create'


  get '/login' => 'sessions#new'
  post '/login' => 'sessions#create'
  delete '/logout' => 'sessions#destroy'  
end
