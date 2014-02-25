class VenuesController < ApplicationController
  def index
  	@venues = Venue.all
  end

  def new
  	@venue = Venue.new
  end

  def show
  end
  
  def create
  	 @venue = Venue.new(venue_params)
  	 @venue.save
  	 redirect_to venues_index_path
  end
  
  private
  
  def venue_params
  	params.require(:venue).permit(:name,:raw_address,:address,:city,:zip,:lat,:long)
  end
  
end
