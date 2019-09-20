# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Transaction, type: :model do
  context 'associations' do
    it { is_expected.to belong_to(:user) }
  end

  context 'validations' do
    it { is_expected.to validate_presence_of(:description) }
    it { is_expected.to validate_presence_of(:date) }
    it { is_expected.to validate_presence_of(:cost) }
  end

  it 'has a valid factory' do
    transaction = create(:transaction)
    expect(transaction).to be_valid
  end
end
