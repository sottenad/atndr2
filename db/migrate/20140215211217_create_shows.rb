class CreateShows < ActiveRecord::Migration
  def change
    create_table :shows do |t|
      t.belongs_to :venue
      t.datetime :date
      
      t.timestamps
    end
  end
end
