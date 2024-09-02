# frozen_string_literal: true

class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.string :name, unique: true
      t.string :email, null: false
      t.string :password_digest
      t.integer :role, default: 0
      t.references :company

      t.timestamps
    end
  end
end
