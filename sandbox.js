const fs = require('fs');
const { parseString } = require('xml2js');
const xml2js = require('xml2js').parseString;

const getMetadata = (metafile) => {
	const MD = ({
		title:'',
		author:'',
		summary:'',
		genre:[],
		isbn:'',
		google_id:''
	})
	parseString(metafile, function(err, results){
		var meta = results.package.metadata[0]
		var identifier = meta['dc:identifier']
		MD.title = meta['dc:title'][0]
		MD.author = meta['dc:creator'][0]['_']
		MD.summary = meta['dc:description'][0]
		MD.genre = meta['dc:subject']
	
		identifier.map(ids => {
			if(ids['$']['opf:scheme'] === 'ISBN'){
				MD.isbn = ids['_']
			}
			if(ids['$']['opf:scheme'] === 'GOOGLE'){
				MD.google_id = ids['_']
			}
		})
	})
	return MD
}

module.exports = getMetadata