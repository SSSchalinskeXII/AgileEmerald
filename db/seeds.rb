# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
Score.delete_all

Score.create!([
  {id: 1, email: "ram@gmail.com", score: 250},
  {id: 2, email: "nor@mail.com", score: 222},
  {id: 3, email: "nor2@mail.com", score: 100},
  {id: 4, email: "nor23@mail.com", score: 21212},
  {id: 5, email: "nor123@mail.com", score: 90}
])