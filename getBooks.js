const fs = require('fs')
const path = require('path')
const {Book, Books} = require('./models/book')
const folder = './files/Calibre Library';
const getMetadata = require('./sandbox')

const getCalibreBooks = () => {
	
	var authors = fs.readdirSync(folder).map(author => {
		var authorPath = path.join(folder, author)
		
		if(!fs.lstatSync(authorPath).isFile()){
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
}
module.exports = getCalibreBooks