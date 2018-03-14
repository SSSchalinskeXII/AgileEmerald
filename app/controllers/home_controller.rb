class HomeController < ApplicationController

  def show
  end
  def index
    @scores = Score.all
  end
  def create
    @scores = Score.all
    @Score = Score.create(score_params)
            

    
  end
  def edit
    @score = Score.find(params[:id])
  end   
  def updaterails 

    @Score = User.find(params[:id])

if    @Score.update_attributes(score_params)
 
#redirect_to '/'
end
  end
  private
  def score_params
    params.permit(:email, :user_score)
  end
  
  
  
end
