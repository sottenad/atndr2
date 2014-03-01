class Show < ActiveRecord::Base
	has_many :artists
	belongs_to :venue
	
	def pretty_date
		return self.date.strftime("%A %b %e")
	end
end
