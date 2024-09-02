# frozen_string_literal: true

class CreateStatements < ActiveRecord::Migration[5.2]
  def change
    create_table :statements do |t|
      t.datetime :performed_at
      t.integer :cost
      t.string :merchant
      t.string :transaction_id
      t.boolean :archived, default: false, null: false
      t.references :category, foreign_key: true
      t.references :card, foreign_key: true

      t.timestamps
    end
  end
end
