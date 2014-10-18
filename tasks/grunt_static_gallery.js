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

module.exports = function(grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	grunt.registerMultiTask('static_gallery', 'Task for gallery', function() {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			photos: ['*.jpeg','*.jpg','*.png','*.gif'],
			metadatafiles: ['title.html','description.html','author.html','showInParent'],
			inputEncoding: 'utf-8',
			outputEncoding: 'utf-8'
		});
		if ( !iconv.encodingExists(options.inputEncoding) ) {
			process.stderr.write('Unsupported encoding : '+options.inputEncoding);
			return;
		}
		if ( !iconv.encodingExists(options.outputEncoding) ) {
			process.stderr.write('Unsupported encoding : '+options.outputEncoding);
			return;
		}

		var src = pth.normalize(this.data.src);
		var dest = pth.normalize(this.data.dest);
		var templateFile = pth.normalize(this.data.template);

		var template = fs.readFileSync(makeAbsolutePath(templateFile)).toString();

		var gallery = {};
		// load data
		gallery = load(makeAbsolutePath(src),makeAbsolutePath(src),options);
		// remove empty album
		recursiveCompute(gallery);
		// compute the nomber of photos in self and children
		sumPhotos(gallery);
		// make html content
		write(makeAbsolutePath(dest),gallery,options,template);
	});

	/** 
	 * Load data from source directory.
	 * Recursive function.
	 */
	function load(path,cwdPath,options) {
		var relative = pth.relative(cwdPath, path);
		var isChild = relative.length > 0;
		var data = {
			path: relative, 
			name: pth.basename(relative), 
			metadata: {},
			albums: [],
			photos: []
		};

		// get metadata
		options.metadatafiles.forEach( function(filename) {
			var dataname = filename.replace(/\.\w+$/i,'');
			var file = grunt.file.expand({nocase:true,filter:'isFile',cwd:path},filename);
			var value = file.reduce(
				function(prevReduce, file){
					return ((prevReduce === undefined) ? '' : prevReduce) + getInfos2(pth.join(path),file, '', options.inputEncoding);
				}, 
				undefined
			);
			if (value !== null && value !== undefined ) {
				//Object.defineProperty(data.meta, dataname, {value:value});
				data.metadata[String(dataname)] = value;
			}
		});

		// get photos
		var localFiles = grunt.file.expand({filter:'isFile',cwd:path,nocase:true},options.photos);
		localFiles = localFiles.sort();
		localFiles.forEach(function(file) {
			// searching metadata
			var description = getInfos2(pth.join(path), file.replace(/\.\w+$/ig,'.html'), '', options.inputEncoding);
			// add
			data.photos.push({name:file, description:description});
		});

		// get albums
		var localDirectories = grunt.file.expand({filter:'isDirectory',cwd:path},'*');
		localDirectories = localDirectories.sort();
		localDirectories.forEach(function(directory) {
			// add to the albums list
			data.albums.push(load(pth.join(cwdPath,relative,directory),cwdPath,options));
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
		var html = ejs.render(
			template, 
			{
				options:options,
				album: data,
				isChild: isChild
			}
		);
		// Create directory if needed
		grunt.file.mkdir(pth.join(cwdPath,data.path));
		var albumFilename = pth.join(cwdPath,data.path,'index.html');
		grunt.log.writeln('File ' + albumFilename + ' created with '+data.albums.length+' album(s) and '+data.photos.length+' photo(s).');
		grunt.file.write(albumFilename, html, {encoding: options.outputEncoding});
		data.albums.forEach(
			function(album){
				write(cwdPath,album,options,template);
			}
		);
	}

	/**
	 * If path is absolute, keep it. If not, make if absolute form the working directory.
	 */
	function makeAbsolutePath(path) {
		if (path === null || path === undefined) {
			path = '';
		}
		return grunt.file.isPathAbsolute(path) ? path : pth.join(process.cwd(),path);
	}

	function getInfos2(path, filename, def, encoding) {
		var res = getInfos(path, filename, encoding);
		return (res===undefined) ? def : res;
	}

	function getInfos(path, filename, encoding) {
		var file = path+'/'+filename;
		if (grunt.file.isFile(file)) {
			var buffer = grunt.file.read(file, {encoding : null});
			var content = iconv.decode(buffer,encoding);
			//console.log( String(content));
			return String(content);
		}
		return undefined;
	}

};
