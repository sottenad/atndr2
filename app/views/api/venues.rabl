object @venues

attributes :name, :lat, :long
child :shows do
	attributes :pretty_date
	child :artists do
		attributes :name
	end
end

