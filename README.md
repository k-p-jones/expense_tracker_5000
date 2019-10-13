# Expense Tracker

A simple expense tracker built while learning React.

**Tech Stack**
* Ruby 5.6.3
* Rails 5.2.3
* React 16.9

**Setting up the development environment**
Note: all commands must be run from the project directory.
* Install `docker` and `docker-compose`
* Build the image: `docker-compose build`
* Install JS libraries: `docker-compose run --rm web yarn`
* Create the database: `docker-compose run --rm web rails db:create`
* Migrate the database: `docker-compose run --rm web rails db:migrate`
* Seed the database: `docker-compose run --rm web rails db:seed`
* Boot the app: `docker-compose up`
* Visit `localhost:3000` and login with the test user credentials that can be found in `seeds.rb`
