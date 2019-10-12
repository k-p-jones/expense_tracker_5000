# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Transactions API', type: :request do
  let(:amount_of_transactions) { 20 }
  let!(:user)                  { create(:user) }
  let!(:transactions)          { create_list(:transaction, amount_of_transactions, user_id: user.id) }

  shared_examples 'it handles a missing record' do
    let(:transaction_id) { 10000 }

    it 'returns status code 404' do
      expect(response).to have_http_status(404)
    end

    it 'returns a failure message' do
      expect(response.body)
      .to match(/Couldn't find Transaction with 'id'=10000/)
    end
  end

  describe 'GET /transactions' do
    context 'without a user signed in' do
      subject { get '/transactions' }
      it { is_expected.to redirect_to('/users/sign_in') }
    end

    context 'with a user signed in' do
      before(:each) do
        sign_in user
        get '/transactions'      
      end

      it 'returns status code 200' do
        expect(response).to have_http_status(200)        
      end

      it 'returns the transactions' do
        transactions = JSON.parse(response.body)
        expect(transactions.length).to be(amount_of_transactions)
      end
    end
  end

  describe 'POST /transactions' do
    let(:invalid_attributes) { { transaction: { date: '20-11-2019' } } }
    let(:valid_attributes) do
      {
        transaction: {
          description: 'Ipad',
          date: '11-11-19',
          cost: 329.99
        }
      }
    end

    context 'without a user signed in' do
      subject { post '/transactions', params: valid_attributes }
      it { is_expected.to redirect_to('/users/sign_in') }
    end

    context 'with a user signed in' do
      before(:each) do
        sign_in user
        post '/transactions', params: attributes
      end

      context 'when the request is valid' do
        let(:attributes) { valid_attributes }

        it 'creates a transaction' do
          transaction = JSON.parse(response.body)
          expect(transaction['description']).to eq(valid_attributes[:transaction][:description])
        end

        it 'returns status code 201' do
          expect(response).to have_http_status(201)
        end
      end 

      context 'when the request is invalid' do
        let(:attributes) { invalid_attributes }

        it 'returns status code 422' do
          expect(response).to have_http_status(422)
        end

        it 'returns a validation failure message' do
          expect(response.body)
            .to match(/Validation failed: Description can't be blank, Cost can't be blank/)
        end
      end
    end
  end

  describe 'PUT /transactions/:id' do
    let(:transaction_id)   { transactions.first.id }
    let(:valid_attributes) { { transaction: { description: 'New Description' } } }

    context 'without a user signed in' do
      subject { put "/transactions/#{transaction_id}", params: valid_attributes }
      it { is_expected.to redirect_to('/users/sign_in') }
    end

    context 'with a user signed in' do
      let(:attributes) { valid_attributes }

      before(:each) do
        sign_in user
        put "/transactions/#{transaction_id}", params: attributes
      end

      context 'with a valid request' do
        it 'updates the transaction' do
          expect(response.body).to be_empty
        end

        it 'returns the status code 204' do
          expect(response).to have_http_status(204)
        end
      end

      it_behaves_like 'it handles a missing record'
    end
  end

  describe 'DELETE /transactions/:id' do
    let(:transaction_id) { transactions.first.id }

    context 'without a user signed in' do
      subject { delete "/transactions/#{transaction_id}" }
      it { is_expected.to redirect_to('/users/sign_in') }
    end

    context 'with a user signed in' do
      before(:each) do
        sign_in user
        delete "/transactions/#{transaction_id}"
      end

      it 'removes the record' do
        expect(response).to have_http_status(204)
      end

      it_behaves_like 'it handles a missing record'
    end
  end
end
