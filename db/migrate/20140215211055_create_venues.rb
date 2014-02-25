class CreateVenues < ActiveRecord::Migration
  def change
    create_table :venues do |t|
      t.string :name
      t.float :lat
      t.float :long
      t.string :raw_address
      t.string :address
      t.string :city
      t.string :zip

      t.timestamps
    end
  end
end
