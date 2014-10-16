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
      main: {
        files: [ {expand: true, nocase:true, cwd: 'test/medias', src: ['**/*.jpeg','**/*.jpg','**/*.png','**/*.gif'], dest: 'tmp/'}]
      }
    },

	/* 
    image_resize: {
		resize: {
			options: {
				width: '150px',
				height: '150px',
				quality: 0.9
			},
			src: 'test/medias/*.*',
			dest: 'tmp/'
		}
	},*/

	// Configuration to be run (and then tested).
    static_gallery: {
      generate: {
        options: {
			photos: ['*.jpeg','*.jpg','*.png','*.gif'],
			inputEncoding: 'cp1252',
			oututEncoding: 'utf-8'
        },
        src: 'test/medias',
        dest: 'tmp',
        template: 'test/page.ejs'
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  //grunt.loadNpmTasks('grunt-image-resize');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'static_gallery', 'copy', /*'image_resize',*/ 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
