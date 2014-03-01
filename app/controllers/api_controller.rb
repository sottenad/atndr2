class ApiController < ApplicationController
  def venues
  	@venues = Venue.all.group("venues.name, venues.id").includes(:shows => :artists)
  end

  def shows
  	@shows = Show.all.order(:date).includes(:artists, :venue)
  end

  def venue
  end
end
