# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# Dummy data for the development environment

if Rails.env.development?
  user = User.create!(email: 'test.user@email.com', password: 'password')
  20.times do
    attrs = {
      description: Faker::Lorem.words(number: 3).join(' '),
      date: Faker::Date.between(from: 2.months.ago, to: Date.today),
      cost: rand(1.0...200.0).round(2)
    }
    user.transactions.create(attrs)
  end
end
