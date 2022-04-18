const axios = require('axios')
const http = require('http')
const cheerio = require('cheerio')
const fs = require('fs');
const { HttpError } = require('http-errors');
const { body, validationResult } = require('express-validator');

const Download = (title, author, link, format) => {
	return({
		_id: Math.round(Math.random()*1e6),
		title: title,
		author: author,
		link: link,
		format: format
	})
}

var Downloads = [];

const getPossibleDownloads = async (searchString) => {
	Downloads = [];
	await axios.get(`http://libgen.is/search.php?req=${searchString}&open=0&res=25&view=simple&phrase=1&column=def`).then( res => {
		var $ = cheerio.load(res.data)
		fs.writeFileSync('parsedData.txt', $('.c').html(), {flag: 'w'},  err => {})
		var list_title_author = []
		var list_link = []
		var list_format = []
		var list_idx = []
		// Super future proof! -_-
		// Iterates through <td> tags in class='c' of libgen books page and works provided every 6th <td> element
		// is a new row denoting each book.
	
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
			
			if(list_format[formatCounter] === 'epub' || list_format[formatCounter] === 'mobi'){
				Downloads.push(Download(title, author, link, list_format[formatCounter]))
			}
			formatCounter++;
		}
	}).then(async () => {
		 for (var i=0;i<Downloads.length;i++){
			await axios.get(Downloads[i].link).then(res => {
				var $ = cheerio.load(res.data)
					var fileLink = $('h2').html()
					fileLink = fileLink.match(/"(.*)"/)[1]
					Downloads[i].link = fileLink
				})
			}
			return Downloads
	})	
}

const downloadFile = (obj) => {
	return new Promise(resolve => {
		http.get(obj.link, res => {
			res.pipe(fs.createWriteStream(`./files/Downloads/${obj.title.trim()}.${obj.format}`) )
			res.on("end", () => {
				console.log('File has been downloadeded.. ', obj.url)
				resolve()
			})
		})
	})
}


exports.download_form = function(req, res){
	res.render('download_form', {downloads: []})
}

exports.download_form_post = function(req, res){
	let searchString = req.body.title.replaceAll(' ','+')

	if(req.body.title === ''){
		res.render('download_form', {downloads: [{title: 'SEARCH IS EMPTY...'}]})
	}
	else{
		getPossibleDownloads(searchString).then( () => 
			res.render('download_form', {downloads: Downloads})
		)
	}
}

exports.download_ebook_form_post = function(req, res){
	var download = Downloads.find( url => url._id == req.params.id)

	async function downloadSendFile(){
		await downloadFile(download)
		res.download(`./files/Downloads/${download.title.trim()}.${download.format}`,`${download.title}.${download.format}`)
	}
	downloadSendFile()
}