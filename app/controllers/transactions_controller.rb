# frozen_string_literal: true

class TransactionsController < ApplicationController
  include Response
  include ErrorHandler

  before_action :authenticate_user!
  before_action :set_transation, only: [:update, :destroy]

  def index
    @transactions = current_user.transactions.all.order(date: :desc)
    json_response(@transactions)
  end

  def create
    @transaction = current_user.transactions.create!(transaction_params)
    json_response(@transaction, :created)
  end

  def update
    @transaction.update(transaction_params)
    head :no_content
  end

  def destroy
    @transaction.destroy
    head :no_content
  end

  private

  def transaction_params
    params.permit(:description, :date, :cost)
  end

  def set_transation
    @transaction = current_user.transactions.find(params[:id])
  end
end
