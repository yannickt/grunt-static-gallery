/*
 * grunt-static-gallery
 * https://github.com/tailliya/grunt-static-gallery
 *
 * Copyright (c) 2014 Yannick Tailliez
 * Licensed under the GPL, v3 licenses.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      options: {
        force: true
      },
      tests: ['tmp/**/*.*']
    },

    copy: {
      test: {
        files: [ {expand: true, nocase:true, cwd: 'test/medias', src: ['**/*.jpeg','**/*.jpg','**/*.png','**/*.gif'], dest: 'tmp/test'}]
      },
      example: {
        files: [ {expand: true, nocase:true, cwd: 'test/medias', src: ['**/*.jpeg','**/*.jpg','**/*.png','**/*.gif'], dest: 'tmp/example'}]
      }
    },

	// Configuration to be run (and then tested).
    static_gallery: {
      test: {
        options: {
			photos: ['*.jpeg','*.jpg','*.png','*.gif'],
			metadatafiles: ['title.html','description.html','author.html'],
			inputEncoding: 'cp1252',
			oututEncoding: 'utf-8',
			file: 'index.html',
			debug: true
        },
        src: 'test/medias',
        dest: 'tmp/test',
        template: 'test/test.ejs'
      },
      example: {
        options: {
			photos: ['*.jpeg','*.jpg','*.png','*.gif'],
			metadatafiles: ['title.html','description.html','author.html'],
			inputEncoding: 'cp1252',
			oututEncoding: 'utf-8',
			file: 'index.html',
			debug: true
        },
        src: 'test/medias',
        dest: 'tmp/example',
        template: 'test/example.ejs'
      }
    },

	image_resize: {
		example: {
			options: {
				width: 300,
				height: 300,
				overwrite: true,
				quality: 0.2
			},
			files : [ {
				// Enable dynamic expansion
				expand : true,
				nocase : true,
				// Src matches are relative to this path
				cwd : 'test/medias', 
				// Actual patterns to match
				src : [ '**/*.{png,jpg,jpeg,gif}'], 
				// Destination path prefix
				dest : 'tmp/example/thumbnails'
			} ]
		}
	},

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    },

    esformatter: {
      src: 'src/**/*.js'
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-esformatter');
  grunt.loadNpmTasks('grunt-image-resize');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'static_gallery::test', 'copy::test', 'nodeunit']);

  grunt.registerTask('example', ['clean', 'static_gallery::example', 'copy::example', 'image_resize::example']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
