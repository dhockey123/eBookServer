const { Book, Books } = require('../models/book')
const { Author, Authors } = require('../models/author')

exports.author_list = function(req, res){
	console.log(Authors[2].name)
	for(var i =0;i<Authors.length;i++){
		console.log("DEBUG:", Authors[i].book_count)
	}
	res.render('author_list', {authors: Authors})
}

exports.author_books = function(req, res){

	var thisAuthor = Authors.find(author => author._id == req.params.id).name 
	console.log(thisAuthor)

	var localbooks = [];
	var author_books = (_id, cover) => {
		return({
			_id: _id,
			cover: cover
		})
	}

	Books.find(book => {
		if(book.authors.includes(thisAuthor)){
			localbooks.push(author_books(book._id, book.cover))
		}
	})
	res.render('genre_books', {books: localbooks})
}