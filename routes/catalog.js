var express = require('express');
var router = express.Router();

var bookController = require('../controllers/bookController')
var genreController = require('../controllers/genreController')
var authorController = require('../controllers/authorController')
var downloadController = require('../controllers/downloadController')

router.get('/', bookController.index)
router.get('/genres', genreController.genre_list)
router.get('/authors', authorController.author_list)
router.get('/authors/:id', authorController.author_books)
router.get('/genres/:id', genreController.genre_index)
router.get('/download', downloadController.download_form)

router.get('/:id', bookController.book_detail)

router.get('/:id/:file', bookController.book_download)

module.exports = router