# frozen_string_literal: true

FactoryBot.define do
  factory :transaction do
    description { Faker::Lorem.words(number: 3).join(' ') }
    date { Faker::Date.between(from: 10.days.ago, to: Date.today) }
    cost { rand(1.0...200.0).round(2) }
    user
  end
end
