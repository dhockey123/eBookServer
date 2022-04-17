const path = require('path');
const {Book, Books} = require('../models/book');
const getCalibreBooks = require('../getBooks');

exports.index = function(req, res){
	if(Books.length === 0){getCalibreBooks()}	
	res.render('index', {books: Books})
}

exports.book_detail = function(req, res) {
	var book = Books.find(book => book._id === req.params.id)

	// res.download(path.join(book.path,book.ebooks[0]), book.ebooks[0])
	res.render('book_detail', {book: book})

}

exports.book_download = function(req, res){
	var book = Books.find(book => book._id === req.params.id)
	res.download(path.join(book.path,req.params.file), req.params.file)
}
