class Venue < ActiveRecord::Base
	has_many :shows
	geocoded_by :street_address, :latitude => :lat, :longitude => :long
	after_validation :geocode
	
	include PgSearch
	pg_search_scope :search_by_name, :against=> :name, 
		:using => {
			:trigram => {:threshold => 0.6}
		}
		
	def self.find_or_make_venue(hash)
		results = Venue.search_by_name(hash[:name])
		if(results.length > 0)
			return results.first
		else
			newVenue = Venue.new(hash)
			newVenue.save
			return newVenue
		end
		
	end
	
	def street_address
		if(!address.nil? && !city.nil? && !zip.nil?)
			return [address, city, zip].compact.join(', ');	
		else
			return raw_address
		end	
	end
	
end
