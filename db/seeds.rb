# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
Score.delete_all

Score.create!([
  {id: 1, email: "drewrw@gmail.com", score: 1250},
  {id: 2, email: "schalen@mail.com", score: 955},
  {id: 3, email: "goodmc@mail.com", score: 856},
  {id: 4, email: "rosteee.ee@mail.com", score: 750},
  {id: 5, email: "ramrsoms@mail.com", score: 755},
  {id: 6, email: "porter.ras@mail.com", score: 650},
  {id: 7, email: "razor.mans@mail.com", score: 550},
  {id: 8, email: "michelle.gosz@mail.com", score: 450},
  {id: 9, email: "paswlraddis@mail.com", score: 550},
  {id: 10, email: "wrongtam@mail.com", score: 350}
])
