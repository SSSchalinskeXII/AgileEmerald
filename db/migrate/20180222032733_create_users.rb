class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :provider
      t.string :uid
      t.string :first_name
      t.string :last_name
      t.string :name
      t.string :email
      t.string :image
      t.string :token
      t.string :oauth_token
      t.string :refresh_token
      t.datetime :oauth_expires_at
      t.string :user_score

      t.timestamps null: false
    end
  end
end
