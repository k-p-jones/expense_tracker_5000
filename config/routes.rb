Rails.application.routes.draw do
  root 'dashboard#index'
  # Block sign ups, Users can only be created from the console.
  devise_for :users, skip: :registrations
  resources :transactions, only: [:index, :create, :update, :destroy]
end
