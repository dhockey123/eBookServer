const Genres = []
const Genre = (category) => {
	return {_id: Math.round(Math.random()*1e12), category: category, count: 1}
}

module.exports = { Genres, Genre }