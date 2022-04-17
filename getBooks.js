const fs = require('fs')
const path = require('path')
const {Book, Books} = require('./models/book')
const {Genre, Genres} = require('./models/genre')
const {Author, Authors} = require('./models/author')
const folder = './files/Calibre Library';
const getMetadata = require('./sandbox')

const getCalibreBooks = () => {
	
	var authors = fs.readdirSync(folder).map(author => {
		var authorPath = path.join(folder, author)
		if(!fs.lstatSync(authorPath).isFile()){
			Authors.push(Author(author, fs.readdirSync(authorPath).length)) 
			return authorPath
		}
	})
	
	for(var i = 0 ; i<authors.length;i++){
		try{
			var files = fs.readdirSync(authors[i])
			for(var j =0; j<files.length;j++){
				var fullPath = path.join(authors[i], files[j])
				var MD = getMetadata(fs.readFileSync(path.join(fullPath, 'metadata.opf'), 'utf8'))
				var imagePath = path.join(fullPath, 'cover.jpg')
				var ebookFiles = [];

				fs.readdirSync(fullPath).map(file => {
					if(file.includes('.mobi')||file.includes('.epub')){
						ebookFiles.push(file)
					}
				})
				// console.log(ebookFiles)
				var book_obj = Book(MD.title,
											 MD.author, 
											 MD.genre, 
											 ebookFiles, 
											 imagePath, 
											 MD.isbn, 
											 MD.summary, 
											 MD.google_id,
											 fullPath)

				Books.push(book_obj)
			}
		}
		catch(err){}
	}

	// GENRES

	for(var i=0;i<Books.length; i++){
		for(var j=0;j<Books[i].genre.length;j++){
			if(!(Genres.find(item => item.category === Books[i].genre[j]))){
				Genres.push(Genre(Books[i].genre[j]))
			}
			else{
				Genres.find(obj=>{
					if(obj.category === Books[i].genre[j]){
						obj.count ++;
					}
				})
			}
		}
	}
	Genres.sort((a, b) => {
		return b.count -a.count
	})
}
getCalibreBooks()


module.exports = getCalibreBooks