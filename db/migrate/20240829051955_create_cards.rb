# frozen_string_literal: true

class CreateCards < ActiveRecord::Migration[5.2]
  def change
    create_table :cards do |t|
      t.string :last4, unique: true
      t.references :user, foreign_key: true

      t.timestamps
    end
    add_index :cards, [:last4], unique: true
  end
end
