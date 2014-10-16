/*
 * grunt-node-gallery-task
 * https://github.com/tailliya/node-gallery-task
 *
 * Copyright (c) 2014 Yannick Tailliez
 * Licensed under the GPL v3 licenses.
 */

'use strict';

//var util = require('util');
//var glob = require('glob');
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

		var directories = grunt.file.expand({filter:'isDirectory'},this.data.src+'/**');
		directories = directories.sort();
		directories.forEach(function(localRoot) {

			var relative = pth.relative(src, localRoot);
			var albums = [];
			var photos = [];

			var localDirectories = grunt.file.expand({filter:'isDirectory',cwd:localRoot},'*');
			localDirectories = localDirectories.sort();
			localDirectories.forEach(function(directory) {
				// have photos ?
				/*
				  var havePhotos = grunt.file.expand({filter:'isFile',cwd:pth.join(localRoot,directory),nocase:true},options.photos)>0;
				  if ( !havePhotos ) {
				  return;
				  }*/

				// searching metadata
				var title = getInfos2(pth.join(localRoot,directory),'title.html', pth.basename(directory), options.inputEncoding);
				var description = getInfos2(pth.join(localRoot,directory),'description.html', '', options.inputEncoding);
				var author = getInfos2(pth.join(localRoot,directory),'author.html', '', options.inputEncoding);
				// add to the albums list
				albums.push({name:directory,label:title, description:description, author: author});
			});			

			var localFiles = grunt.file.expand({filter:'isFile',cwd:localRoot,nocase:true},options.photos);
			localFiles = localFiles.sort();
			localFiles.forEach(function(file) {
				// searching metadata
				var description = getInfos2(pth.join(localRoot), file.replace(/.\w+$/ig,'.html'), '', options.inputEncoding);
				// add
				photos.push({name:file, description:description});
			});			

			var title = getInfos2(pth.join(localRoot),'title.html', pth.basename(localRoot), options.inputEncoding);
			var description = getInfos2(pth.join(localRoot),'description.html', '', options.inputEncoding);
			var author = getInfos2(pth.join(localRoot),'author.html', '', options.inputEncoding);
			var backLink = relative.length>0;

			// Create html page content
			var html = ejs.render(
				template, 
				{
					options:options,
					label:title, 
					author: author, 
					description:description, 
					backLink: backLink,
					albums:albums, 
					photos:photos
				}
			);

			// Create directory if needed
			grunt.file.mkdir(pth.join(dest,relative));
			var albumFilename = pth.join(dest,relative,'index.html');
			grunt.log.writeln('File ' + albumFilename + ' created with '+albums.length+' album(s) and '+photos.length+' photo(s).');
			//fs.writeFileSync(albumFilename,html,options.outputEncoding);
			grunt.file.write(albumFilename, html, {encoding: options.outputEncoding});
		});

	});

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
