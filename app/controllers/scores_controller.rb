class ScoresController < ApplicationController


def index
    @scores = Score.all

  end

  def show
  
    @score = Score.find(params[:id])
  end

  def new
    @score = Score.new
  end

  def create
    @scores = Score.all
    @Score = Score.create(score_params)
            

    
  end

  def edit
    @score = Score.find(params[:id])
  end

  def update
    @scores = Score.all
    @Score = Score.find(params[:id])

     if @Score.update_attributes(score_params)

redirect_to '/'
end

        
 
  end
  

  def delete
    @Score = Score.find(params[:score_id])
  end

  def destroy
    @scores = Score.all
    @Score = Score.find(params[:id])
    @Score.destroy
  end
  

private
  def score_params
    params.require(:score).permit(:email, :score)
  end
  
    def gameScore
    user_score = 120
    score = Score.create(user_id: session[:user_id], score: user_score)
    if score.save
      respond_to do |format|
        format.html {redirect_to root_path}
      end
    end
  end
  
end
