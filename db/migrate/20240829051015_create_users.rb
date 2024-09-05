# frozen_string_literal: true

class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.string :name
      t.string :email, null: false, unique: true
      t.string :password_digest
      t.integer :role, default: 0
      t.references :company

      t.timestamps
    end
  end
end
