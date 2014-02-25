class CreateGenres < ActiveRecord::Migration
  def change
    create_table :genres do |t|
      t.belongs_to :artist
      t.string :name

      t.timestamps
    end
  end
end
