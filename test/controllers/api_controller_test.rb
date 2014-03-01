require 'test_helper'

class ApiControllerTest < ActionController::TestCase
  test "should get shows" do
    get :shows
    assert_response :success
  end

  test "should get artist" do
    get :artist
    assert_response :success
  end

  test "should get venue" do
    get :venue
    assert_response :success
  end

end
