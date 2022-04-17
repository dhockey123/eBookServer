const {Book, Books} = require('../models/book')
const { Genre, Genres }  = require('../models/genre')

exports.genre_list = function(req, res){
	console.log(Genres.length)
	res.render('genre_list', {genres: Genres})
}

exports.genre_index = function(req, res){

	var thisGenre = Genres.find(genre => genre._id == req.params.id).category
	var localbooks = [];

	var genre_books = (_id, cover) => {
		return({
			_id: _id,
			cover: cover
		})
	}

	Books.find(book => {
		if(book.genre.includes(thisGenre)){
			localbooks.push(genre_books(book._id, book.cover))
		}
	})
	
	res.render('genre_books', {books: localbooks})

}
