

const Authors = []
const Author = (author, book_count) => {
	return { _id: Math.round(Math.random()*1e12), name: author, book_count:book_count}
}

module.exports = { Authors, Author}