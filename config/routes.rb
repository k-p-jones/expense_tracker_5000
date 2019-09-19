Rails.application.routes.draw do
  root 'dashboard#index'
  # Block sign ups, Users can only be created from the console.
  devise_for :users, skip: :registrations
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
