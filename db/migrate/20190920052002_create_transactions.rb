class CreateTransactions < ActiveRecord::Migration[5.2]
  def change
    create_table :transactions do |t|
      t.string :description
      t.date :date
      t.float :cost
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
