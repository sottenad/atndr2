

## Get Started
* clone this repo somewhere
* `cd` to that dir
* run `bundle install`
* run `rake db:migrate`
* run `rake seattle:seattle_stranger` to populate db
* run `rails s`
* goto http://localhost:3000

###API Methods
* `/api/shows` - This gives you all the shows grouped by venue. Important for the map view.

###Notes on API
We're using rabl. To alter the output of the api, check the appropriate `.rabl` files in the view folder.