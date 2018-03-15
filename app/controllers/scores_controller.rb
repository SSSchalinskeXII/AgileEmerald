class ScoresController < ApplicationController

  def index
    @scores = Score.all.order("score DESC")
  end

  def show
  
    @score = Score.find(params[:id])
  end

  def new
    puts score_params.inspect
    @score = Score.create(score_params)
    @score.save
    respond_to do |wants|
      wants.json { render json: { "score": "Saved Score!" } }
    end

  end

  def create
    @scores = Score.all
    @Score = Score.create(score_params)
            
    redirect_to '/'
    
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
    params.permit(:score, :email)
  end
end
