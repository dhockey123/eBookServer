var express = require('express');
var router = express.Router();

var bookController = require('../controllers/bookController')
var downloadController = require('../controllers/downloadController')

router.get('/', bookController.index)

router.get('/download', downloadController.download_form)
router.get('/:id', bookController.book_detail)

router.get('/:id/:file', bookController.book_download)

module.exports = router