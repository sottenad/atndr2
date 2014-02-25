class Artist < ActiveRecord::Base
	belongs_to :show
	has_many :genre
	
	include PgSearch
	pg_search_scope :search_by_name, :against=> :name, 
		:using => {
			:trigram => {:threshold => 0.85}
		}
		
	def self.find_or_make_artist(hash)
		results = Artist.search_by_name(hash[:name])
		if(results.length > 0)
			return results.first
		else
			newArtist = Artist.new(hash)
			newArtist.save
			return newArtist
		end
		
	end
end
