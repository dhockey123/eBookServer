const id = () => {
	return String(Math.round(Math.random()*1e12));
}

var Books = []
const Book = (title, authors, genre, ebooks, cover, isbn, summary, google_id, path) => {
	return({
		_id: id(),
		title: title,
		authors: authors,
		genre: genre,
		ebooks: ebooks,
		cover: cover,
		summary: summary,
		google_id: google_id,
		isbn: isbn,
		path: path
	})
}


module.exports = { Books, Book }