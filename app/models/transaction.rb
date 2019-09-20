# create_table "transactions", force: :cascade do |t|
#   t.string "description"
#   t.date "date"
#   t.float "cost"
#   t.bigint "user_id"
#   t.datetime "created_at", null: false
#   t.datetime "updated_at", null: false
#   t.index ["user_id"], name: "index_transactions_on_user_id"
# end

class Transaction < ApplicationRecord
  belongs_to :user
  validates :description, :date, :cost, presence: true
end
