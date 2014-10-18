# grunt-static-gallery

> Task grunt-static-gallery

The purpose of this task is to generate HTML pages for a gallery. It use directory structure to make content. [EJS](http://www.embeddedjs.com/) tempate is use for HTML generation.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-static-gallery --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-static-gallery');
```

## The "node_gallery_task" task

### Overview
In your project's Gruntfile, add a section named `node_gallery_task` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  static_gallery: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.photos
Type: `Array of string`
Default value: `['*.jpeg','*.jpg','*.png','*.gif']`

List of the image files to use.

#### options.metadatafiles
Type: `String`
Default value: `['title.html','description.html','author.html','showInParent']`

List of the matadata files to use. Content will be available in the template file.

#### options.inputEncoding
Type: `String`
Default value: `utf-8`

Encoding used in matadatafile. See [iconv-lite](https://github.com/ashtuchkin/iconv-lite)

#### options.outputEncoding
Type: `String`
Default value: `utf-8`

Encoding for output HTML files. See [iconv-lite](https://github.com/ashtuchkin/iconv-lite)

### Usage Examples

In this example, the default options are used. HTML files and directory structure are generate in `tmp` directory with the image and metadata file in `test/medias` directory. The HTML pages are generate with `test/page.ejs` template file.

```js
grunt.initConfig({
  static_gallery: {
    options: {},
    src: 'test/medias',
    dest: 'tmp',
    template: 'test/page.ejs'
  },
});
```

#### Data available in template file

```json
{
	options: {...},
	album: {
		path: 'folder 1', 
		name: 'folder 1', 
		metadata: {
		    title: 'My first directory',
			author: 'My self',
			description: 'My first test'
		},
		albums: [{
			path: 'folder 1_1', 
			name: 'folder 1_1', 
			metadata: {
			    title: 'My first inner directory',
				author: 'My self',
				description: 'My other first test'
			},
			albums: [],
			photos: [
				{ name: '1_1.jpg', description: 'First inner image' }, 
				{ name: '1_2.jpg', description: 'Second inner image' } 
			]
		}],
		photos: [
			{ name: '1.jpg', description: 'First image' }, 
			{ name: '2.jpg', description: 'Second image' } 
		]
	},
	isChild: true,
}
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
