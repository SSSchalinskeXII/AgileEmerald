class HomeController < ApplicationController
  def show
  end
  def index
    @scores = User.all
  end
    def edit
    @score = User.find(params[:id])
  end
end
