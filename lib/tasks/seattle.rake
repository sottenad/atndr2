namespace :seattle do
	require 'nokogiri'
	require 'open-uri'
	require 'chronic'
	require 'set'
	
	task :seattle_stranger => :environment do
	
		baseUrl = 'http://www.thestranger.com'

		#get venues
		today = Date.today
		for i in 0..30
			timestamp = (today+i).to_s
			puts 'Making Venues/Artists/Shows for: '+timestamp
			
			originalUrl = baseUrl+'/gyrobase/EventSearch?eventSection=3208279&narrowByDate='+timestamp
			list = Nokogiri::HTML(open(originalUrl))
			
			pages = Array.new
			
			#find pagination links
			pages.push(originalUrl)
			pagesLinks = list.css('#PaginationBottom a')
			pagesLinks.each do |p|
				url = baseUrl + p.attr('href')
				pages.push(url) unless pages.include?(url)
			end
			puts pages
			
			pages.each do |page|
				if page != originalUrl
					list = Nokogiri::HTML(open(page))
				end
				
				
				#Get Listings from this page.
				eventListings = list.css('.EventListing')
				eventListings.each do |ev|
		
					#should only be one, but lets do it this way to be safe	
					sv = nil		
					venues = ev.css('.listingLocation')
					venues.each do |v|
						name = v.css('a').text
						location = v.xpath('text()').text.strip + ' Seattle, WA'
						if(!name.nil? && !location.nil?)
							nv = {"name" => name, "raw_address" => location}
							found = Venue.find_or_make_venue(nv);
							sv = found
						end
					end #venues.each
					
					#if we dont have a venue, end this loop. better to miss some than have cluttered data
					if (sv.nil?)
					 break
					end
					
					artistArr = Array.new
					artistStr = ev.css('.search-results-title')
					artistStr.each do |b|
						str = b.text.sub(/^(.*?):/, '')
						bArr = str.split(',')
						bArr.each do |ib|
							if(!ib.downcase.include? "guest")
								artistArr << Artist.find_or_make_artist({"name"=>ib.strip});
							end
						end
						
					end #artistStr.each
				
					#Create Show
					ns = Show.new({"venue" => sv, "artists" => artistArr, :date => today});
					ns.save

				end #eventListings.each
			end #each pages
		end #for i in 0..30
	end #seattle_stranger

end #seattle