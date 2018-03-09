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

    @Score.update_attributes(score_params)
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
end
