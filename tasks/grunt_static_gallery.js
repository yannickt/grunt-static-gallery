/*
 * grunt-node-gallery-task
 * https://github.com/tailliya/node-gallery-task
 *
 * Copyright (c) 2014 Yannick Tailliez
 * Licensed under the GPL v3 licenses.
 */

'use strict';

var fs = require('fs'); // file system
var pth = require('path'); // path
var ejs = require('ejs'); // template
var iconv = require('iconv-lite'); // encoding
var exif;
try {
	exif = require('exif-parser'); // exif metadata
}
catch(e) {
}

module.exports = function(grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	grunt.registerMultiTask('static_gallery', 'Task for gallery', function() {
		// Control existance of required data
		if ( !this.data.src ) {
			grunt.fail.fatal('Data "src" is missing');
		}
		if ( !this.data.dest ) {
			grunt.fail.fatal('Data "dest" is missing');
		}
		if ( !this.data.template ) {
			grunt.fail.fatal('Data "template" is missing');
		}
		
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			photos: ['*.jpeg','*.jpg','*.png','*.gif'],
			metadatafiles: ['title.html','description.html'],
			inputEncoding: 'utf-8',
			outputEncoding: 'utf-8',
			file: 'index.html',
			debug: false
		});
		if (!exif) {
			grunt.log.writeln('Module "exif-parser" not found, so exif data will be not avalaible.');
		}
		// Control encoding values
		if ( !iconv.encodingExists(options.inputEncoding) ) {
			grunt.fail.warn('Unsupported encoding : '+options.inputEncoding);
			options.inputEncoding = 'utf-8';
		}
		if ( !iconv.encodingExists(options.outputEncoding) ) {
			grunt.fail.warn('Unsupported encoding : '+options.outputEncoding);
			options.outputEncoding = 'utf-8';
		}

		var src = pth.resolve(this.data.src);
		var dest = pth.resolve(this.data.dest);
		var templateFile = pth.resolve(this.data.template);

		var template = fs.readFileSync(templateFile).toString();

		var gallery = {};
		// load data
		gallery = load( src, src, [] ,options );
		// remove empty album
		recursiveCompute( gallery );
		// compute the nomber of photos in self and children
		sumPhotos( gallery );
		// make html content
		write( dest, gallery, options, template );
	});

	/** 
	 * Load data from source directory.
	 * Recursive function.
	 */
	function load( path, cwdPath, parents, options ) {
		var relative = pth.relative(cwdPath, path);
		var isChild = relative.length > 0;
		var data = {
			path: relative, 
			name: pth.basename(relative), 
			parents: parents, 
			metadata: {}
		};

		// get metadata
		options.metadatafiles.forEach( function(filename) {
			var dataname = filename.replace(/\.\w+$/i,'');
			var file = grunt.file.expand({nocase:true,filter:'isFile',cwd:path},filename);
			var value = data.metadata[String(dataname)] ? data.metadata[String(dataname)] : undefined;
			var filesContent = file.reduce(
				function(prevReduce, file){
					var fileContent = getInfos(pth.join(path),file, undefined, options.inputEncoding);
					if ( fileContent !== undefined && fileContent !== null ) {
						if ( prevReduce !== undefined && prevReduce !== null ) {
							return prevReduce + fileContent;
						}
						else {
							return fileContent;
						}
					}
					return prevReduce;
					//return ((prevReduce === undefined) ? '' : prevReduce) + getInfos(pth.join(path),file, '', options.inputEncoding);
				}, 
				undefined
			);
			if ( value && filesContent ) {
				value += filesContent;
			}
			else if ( !value && filesContent ) {
				value = filesContent;
			}
			if ( !value ) {
				value = null;
			}
			data.metadata[String(dataname)] = value;
		});

		// get albums
		{
			var dataForParents = JSON.parse(JSON.stringify(data));
			dataForParents.parents = undefined;
			dataForParents.albums = undefined;
			dataForParents.photos = undefined;
			data.albums = [];
			var localDirectories = grunt.file.expand({filter:'isDirectory',cwd:path},'*');
			localDirectories = localDirectories.sort();
			localDirectories.forEach(function(directory) {
				var dataParents = parents.concat(dataForParents);
				// add to the albums list
				data.albums.push(load(pth.join(cwdPath,relative,directory), cwdPath, dataParents, options));
			});
		}
		
		// get photos
		data.photos = [];
		var localFiles = grunt.file.expand({filter:'isFile',cwd:path,nocase:true},options.photos);
		localFiles = localFiles.sort();
		localFiles.forEach(function(file) {
			grunt.log.writeln('Compute '+pth.join(relative,file));
			var photoData = { name: file };
			// searching metadata
			var description = getInfos(pth.join(path), file.replace(/\.\w+$/ig,'.html'), '', options.inputEncoding);
			photoData.description = description;
			// exif metadata
			if (exif) {
				try {
					var buffer = grunt.file.read(pth.join(path,file),{encoding:null});
					var parser = exif.create(buffer);
					var result = parser.parse();
					if ( result.tags.XPTitle ) {
						result.tags.XPTitle = iconv.decode(new Buffer(result.tags.XPTitle),'ucs-2');
					}
					if ( result.tags.XPAuthor ) {
						result.tags.XPAuthor = iconv.decode(new Buffer(result.tags.XPAuthor),'ucs-2');
					}
					if ( result.tags.XPComment ) {
						result.tags.XPComment = iconv.decode(new Buffer(result.tags.XPComment),'ucs-2');
					}
					photoData.exif = result.tags;
				}
				catch(e) {
					grunt.log.writeln("Can't read exif data of " + pth.join(relative,file));
				}
			}
			// add
			data.photos.push(photoData);
		});

		return data;
	}

	/** 
	 * Remove empty album. 
	 * Recursive function.
	 */
	function recursiveCompute(data) {
		data.albums = data.albums.filter(function(album) {
			return recursiveCompute(album);
		});
		if ( data.albums.length === 0 && data.photos.length === 0 ) {
			grunt.log.writeln("Folder "+data.path+" empty");
			return false;
		}
		return true;
	}

	/** 
	 * Compute the number of photos in self and children.
	 * Recursive function.
	 */
	function sumPhotos(data) {
		var nbr = data.photos.length + data.albums.reduce(function(previousReduce, album){return previousReduce + sumPhotos(album);},0);
		data.sumPhotos = nbr;
		return nbr;
	}

	/** 
	 * Create html content from template.
	 * Recursive function.
	 */
	function write(cwdPath,data,options,template) {
		var isChild = data.path.length>0;
		// Create html page content
		var dataTemplate = {
			options:options,
			album: data,
			isChild: isChild
		};
		var html = ejs.render( template, dataTemplate );
		// Create directory if needed
		grunt.file.mkdir(pth.join(cwdPath,data.path));
		var albumFilename = pth.join(cwdPath,data.path,options.file);
		grunt.log.writeln('File ' + albumFilename + ' created with '+data.albums.length+' album(s) and '+data.photos.length+' photo(s).');
		grunt.file.write(albumFilename, html, {encoding: options.outputEncoding});
		if ( options.debug ) {
			grunt.file.write(pth.join(cwdPath,data.path,'debug.json'), JSON.stringify(dataTemplate,null,'   '), {encoding: options.outputEncoding});
		}
		data.albums.forEach(
			function(album){
				write(cwdPath,album,options,template);
			}
		);
	}

	/**
	 * Return the content of a file, or a default value.
	 */
	function getInfos(path, filename, def, encoding) {
		var file = pth.join(path,filename);
		if (grunt.file.isFile(file)) {
			var buffer = grunt.file.read(file, {encoding : null});
			var content = iconv.decode(buffer,encoding);
			return String(content);
		}
		return def;
	}

};
