namespace :artist_meta do
	
	require 'open-uri'	
	require 'json'
	
	task :get_genres => :environment do
		api_key = '26fc397576313d41c518bbb75391276a'
		info_url = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&api_key='+api_key+'&format=json&artist='
		
		artists = Artist.all


		artists.each do |a|
			puts a.name
			artist_name = URI::encode(a.name)
			info = open(info_url+artist_name).read

			result = JSON.parse(info);
			
			artist = result['artist']
			if(!artist.nil? && !artist.empty?)
				tags = artist['tags']['tag']
				if(!tags.nil? && !tags.empty?)
					if(tags.is_a? Hash)
						tags = [tags]
					end
					tags.each do |t|
						puts '------ '+ t['name']
						thisgenre = Genre.find_or_create_by_name(t['name'])
						a.genres << thisgenre
					end
				end
			end
		end
	end
	
end