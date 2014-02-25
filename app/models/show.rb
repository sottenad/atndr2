class Show < ActiveRecord::Base
	has_many :artists
	belongs_to :venue
end
