  FROM ruby:2.6.3
  RUN apt-get update -qq && apt-get install -y build-essential \
      libpq-dev

  RUN curl -sL https://deb.nodesource.com/setup_12.x | bash \
   && apt-get update && apt-get install -y nodejs && rm -rf /var/lib/apt/lists/* \
   && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
   && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
   && apt-get update && apt-get install -y yarn && rm -rf /var/lib/apt/lists/*

  RUN mkdir /app
  WORKDIR /app

  COPY Gemfile Gemfile.lock ./
  RUN gem install bundler && bundle install --jobs 8 --frozen && rm /usr/local/bundle/config

  COPY . /app

  ENTRYPOINT ["scripts/entrypoint.sh"]
  CMD ["rails", "server", "-b", "0.0.0.0"]
