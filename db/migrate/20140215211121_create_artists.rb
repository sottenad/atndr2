class CreateArtists < ActiveRecord::Migration
  def change
    create_table :artists do |t|
      t.belongs_to :show
      t.string :name
      t.string :image

      t.timestamps
    end
  end
end
