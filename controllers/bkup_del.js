const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const { router } = require('../app')

const Download = (title, author, link, format) => {
	return({
		title: title,
		author: author,
		link: link,
		format: format
	})
}

const Downloads = [];

axios.get('http://libgen.is/search.php?req=stephen+king+insomnia&open=0&res=25&view=simple&phrase=1&column=def').then( res => {
	var $ = cheerio.load(res.data)
	fs.writeFileSync('parsedData.txt', $('.c').html(), {flag: 'w'},  err => {})
	var list_title_author = []
	var list_link = []
	var list_format = []
	var list_idx = []

	// Super future proof! -_-

	$('td').each(function(idx,ele){
		if(idx != 1){
			var fileFormat = $(this).html()
			if(fileFormat === 'epub' || fileFormat === 'mobi' || fileFormat === 'pdf'){
				list_format.push(fileFormat)
			}
			if($(ele).children('a').html() != null){
				list_idx.push(idx)
				list_title_author.push($(ele).children('a').html())
				list_link.push($(ele).children('a').attr('href'))
			}
		}
	})

	// Iterates through <td> tags in class='c' of libgen books page and works provided every 6th <td> element
	// is a new row denoting each book.

	var title, author, link;
	var formatCounter = 0
	for(var i=0;i<list_link.length;i=i+6){
		if(list_title_author[i+1].split('<')[0] === ''){
			title = list_title_author[i+1].match(/<i>(.*)<\/i>/)[1]
		}
		else{
			title = list_title_author[i+1].split('<')[0];
		}
		author = list_title_author[i]
		link = list_link[i+2]

		// console.log(title, "\n", author, "\n", link, "\n", list_format[formatCounter], "\n\n")
		if(list_format[formatCounter] === 'epub' || list_format[formatCounter] === 'mobi'){
			Downloads.push(Download(title, author, link, list_format[formatCounter]))
		}
		formatCounter++;
	}
	console.log(Downloads)
})
// .then(
// 	axios.get('http://library.lol/main/5115C89666A2DC836D09CC67E452724E').then(res => {
	
// 		var $ = cheerio.load(res.data)
// 		link = $('h2').html()
// 		link = link.match(/"(.*)"/)[0]
// 	})
// 	)
exports.download_form = function(req, res){
	// res.render('download_form', {title: 'test'})
	res.render('download_form', {downloads: Downloads})
	// res.download(link, 'test.epub')
}


