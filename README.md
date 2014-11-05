# grunt-static-gallery

> Task grunt-static-gallery

The purpose of this task is to generate HTML pages for a gallery. It use directory structure to make content. [EJS](http://www.embeddedjs.com/) tempate is used for HTML generation.
This task don't :
* copy images files from source to destination directory
* resize images


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

### Example

To see a example, use the following command in the module directory. The input data come from `test/medias`, the process from `Gruntfile`, and the result will be found in `tmp\example`.

```shell
grunt example
```


## The "grunt_static_gallery" task

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
Default value: `['title.html','description.html']`

List of the matadata files to use. Content will be available in the template file.

#### options.inputEncoding
Type: `String`
Default value: `utf-8`

Encoding used in matadatafile. See [iconv-lite](https://github.com/ashtuchkin/iconv-lite)

#### options.outputEncoding
Type: `String`
Default value: `utf-8`

Encoding for output HTML files. See [iconv-lite](https://github.com/ashtuchkin/iconv-lite)

#### options.template
Type: `String`
Default value: `none`

Name of the template file use to created gallery.

#### options.file
Type: `String`
Default value: `index.html`

Name of the file(s) created by the template, in the dest directory and sub-directory.

#### options.debug
Type: `Boolean`
Default value: `false`

If true, create a debug.json file in the dest directory, with data available to the template.

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

All data coorespond to the current album and it's childs.

option : Task's options
album : Directory content
album.path : Relative directory path
album.name : Album name
album.metadata : Album metadata. Content of file options.metadatafiles in the album directory.
album.metadata.xxx : Album metadata. Content of file xxx.{ext} in the album directory.
album.albums : Albums in album.
album.parents : List of parents album, with metadata.
album.photos : List of the album's photos.
album.photos[].name : Image's filename.
album.photos[].description : Image's metadata. Content of file {image's filename}.html in the album directory.filename.
album.photos[].exif : List of exif data of the file.
album.sumPhotos: Total number of photo in this album and him child(ren).

Exemple of data :
```js
{
   "options": {
      "photos": [
         "*.jpeg",
         "*.jpg",
         "*.png",
         "*.gif"
      ],
      "metadatafiles": [
         "title.html",
         "description.html",
         "author.html",
         "showInParent"
      ],
      "inputEncoding": "cp1252",
      "outputEncoding": "utf-8",
      "file": "index.html",
      "debug": true,
      "oututEncoding": "utf-8"
   },
   "album": {
      "path": "",
      "name": "",
      "parents": [],
      "metadata": {
         "title": "undefined",
         "description": "undefined",
         "author": "undefined",
         "showInParent": "undefined"
      },
      "albums": [
         {
            "path": "folder1",
            "name": "folder1",
            "parents": [
               {
                  "path": "",
                  "name": "",
                  "metadata": {
                     "title": "undefined",
                     "description": "undefined",
                     "author": "undefined",
                     "showInParent": "undefined"
                  }
               }
            ],
            "metadata": {
               "title": "undefined",
               "description": "undefined",
               "author": "undefined",
               "showInParent": "undefined"
            },
            "albums": [
               {
                  "path": "folder1\\folder11",
                  "name": "folder11",
                  "parents": [
                     {
                        "path": "",
                        "name": "",
                        "metadata": {
                           "title": "undefined",
                           "description": "undefined",
                           "author": "undefined",
                           "showInParent": "undefined"
                        }
                     },
                     {
                        "path": "folder1",
                        "name": "folder1",
                        "metadata": {
                           "title": "undefined",
                           "description": "undefined",
                           "author": "undefined",
                           "showInParent": "undefined"
                        }
                     }
                  ],
                  "metadata": {
                     "title": "Title of the folder 11",
                     "description": "undefined",
                     "author": "undefined",
                     "showInParent": "undefined"
                  },
                  "albums": [
                     {
                        "path": "folder1\\folder11\\folder111",
                        "name": "folder111",
                        "parents": [
                           {
                              "path": "",
                              "name": "",
                              "metadata": {
                                 "title": "undefined",
                                 "description": "undefined",
                                 "author": "undefined",
                                 "showInParent": "undefined"
                              }
                           },
                           {
                              "path": "folder1",
                              "name": "folder1",
                              "metadata": {
                                 "title": "undefined",
                                 "description": "undefined",
                                 "author": "undefined",
                                 "showInParent": "undefined"
                              }
                           },
                           {
                              "path": "folder1\\folder11",
                              "name": "folder11",
                              "metadata": {
                                 "title": "Title of the folder 11",
                                 "description": "undefined",
                                 "author": "undefined",
                                 "showInParent": "undefined"
                              }
                           }
                        ],
                        "metadata": {
                           "title": "Title of folder 111\r\n",
                           "description": "Description for the folder 111. Et voilà ! \r\n",
                           "author": "undefined",
                           "showInParent": ""
                        },
                        "albums": [],
                        "photos": [
                           {
                              "name": "img_111a.jpg",
                              "description": "Content of img_111a.html file\n",
                              "exif": {
                                 "ImageDescription": "ImageDescription of medias/folder1/folder11/folder111/img_111a.jpg",
                                 "XResolution": 72,
                                 "YResolution": 72,
                                 "ResolutionUnit": 2,
                                 "Artist": "Artist of medias/folder1/folder11/folder111/img_111a.jpg",
                                 "YCbCrPositioning": 1,
                                 "XPTitle": "XPTitle of medias/folder1/folder11/folder111/img_111a.jpg\u0000",
                                 "XPComment": "XPComment of medias/folder1/folder11/folder111/img_111a.jpg\u0000",
                                 "XPAuthor": "XPAuthor of medias/folder1/folder11/folder111/img_111a.jpg\u0000"
                              }
                           },
                           {
                              "name": "img_111b.png",
                              "description": ""
                           }
                        ],
                        "sumPhotos": 2
                     },
                     {
                        "path": "folder1\\folder11\\folder112",
                        "name": "folder112",
                        "parents": [
                           {
                              "path": "",
                              "name": "",
                              "metadata": {
                                 "title": "undefined",
                                 "description": "undefined",
                                 "author": "undefined",
                                 "showInParent": "undefined"
                              }
                           },
                           {
                              "path": "folder1",
                              "name": "folder1",
                              "metadata": {
                                 "title": "undefined",
                                 "description": "undefined",
                                 "author": "undefined",
                                 "showInParent": "undefined"
                              }
                           },
                           {
                              "path": "folder1\\folder11",
                              "name": "folder11",
                              "metadata": {
                                 "title": "Title of the folder 11",
                                 "description": "undefined",
                                 "author": "undefined",
                                 "showInParent": "undefined"
                              }
                           }
                        ],
                        "metadata": {
                           "title": "undefined",
                           "description": "undefined",
                           "author": "undefined",
                           "showInParent": "undefined"
                        },
                        "albums": [],
                        "photos": [
                           {
                              "name": "img_112a.jpg",
                              "description": "",
                              "exif": {
                                 "ImageDescription": "ImageDescription of medias/folder1/folder11/folder112/img_112a.jpg",
                                 "XResolution": 72,
                                 "YResolution": 72,
                                 "ResolutionUnit": 2,
                                 "Artist": "Artist of medias/folder1/folder11/folder112/img_112a.jpg",
                                 "YCbCrPositioning": 1,
                                 "XPTitle": "XPTitle of medias/folder1/folder11/folder112/img_112a.jpg\u0000",
                                 "XPComment": "XPComment of medias/folder1/folder11/folder112/img_112a.jpg\u0000",
                                 "XPAuthor": "XPAuthor of medias/folder1/folder11/folder112/img_112a.jpg\u0000"
                              }
                           }
                        ],
                        "sumPhotos": 1
                     }
                  ],
                  "photos": [],
                  "sumPhotos": 3
               },
               {
                  "path": "folder1\\folder12",
                  "name": "folder12",
                  "parents": [
                     {
                        "path": "",
                        "name": "",
                        "metadata": {
                           "title": "undefined",
                           "description": "undefined",
                           "author": "undefined",
                           "showInParent": "undefined"
                        }
                     },
                     {
                        "path": "folder1",
                        "name": "folder1",
                        "metadata": {
                           "title": "undefined",
                           "description": "undefined",
                           "author": "undefined",
                           "showInParent": "undefined"
                        }
                     }
                  ],
                  "metadata": {
                     "title": "undefined",
                     "description": "undefined",
                     "author": "undefined",
                     "showInParent": "undefined"
                  },
                  "albums": [],
                  "photos": [
                     {
                        "name": "img_12a.jpg",
                        "description": "",
                        "exif": {
                           "ImageDescription": "ImageDescription of medias/folder1/folder12/img_12a.jpg",
                           "XResolution": 72,
                           "YResolution": 72,
                           "ResolutionUnit": 2,
                           "Artist": "Artist of medias/folder1/folder12/img_12a.jpg",
                           "YCbCrPositioning": 1,
                           "XPTitle": "XPTitle of medias/folder1/folder12/img_12a.jpg\u0000",
                           "XPComment": "XPComment of medias/folder1/folder12/img_12a.jpg\u0000",
                           "XPAuthor": "XPAuthor of medias/folder1/folder12/img_12a.jpg\u0000"
                        }
                     }
                  ],
                  "sumPhotos": 1
               }
            ],
            "photos": [],
            "sumPhotos": 4
         },
         {
            "path": "folder2",
            "name": "folder2",
            "parents": [
               {
                  "path": "",
                  "name": "",
                  "metadata": {
                     "title": "undefined",
                     "description": "undefined",
                     "author": "undefined",
                     "showInParent": "undefined"
                  }
               }
            ],
            "metadata": {
               "title": "undefined",
               "description": "undefined",
               "author": "undefined",
               "showInParent": "undefined"
            },
            "albums": [],
            "photos": [
               {
                  "name": "img_2a.jpg",
                  "description": "",
                  "exif": {
                     "ImageDescription": "ImageDescription of medias/folder2/img_2a.jpg",
                     "XResolution": 72,
                     "YResolution": 72,
                     "ResolutionUnit": 2,
                     "Artist": "Artist of medias/folder2/img_2a.jpg",
                     "YCbCrPositioning": 1,
                     "XPTitle": "XPTitle of medias/folder2/img_2a.jpg\u0000",
                     "XPComment": "XPComment of medias/folder2/img_2a.jpg\u0000",
                     "XPAuthor": "XPAuthor of medias/folder2/img_2a.jpg\u0000"
                  }
               }
            ],
            "sumPhotos": 1
         }
      ],
      "photos": [
         {
            "name": "img_a.jpg",
            "description": "",
            "exif": {
               "ImageDescription": "ImageDescription of medias/img_a.jpg",
               "XResolution": 72,
               "YResolution": 72,
               "ResolutionUnit": 2,
               "Artist": "Artist of medias/img_a.jpg",
               "YCbCrPositioning": 1,
               "XPTitle": "XPTitle of medias/img_a.jpg\u0000",
               "XPComment": "XPComment of medias/img_a.jpg\u0000",
               "XPAuthor": "XPAuthor of medias/img_a.jpg\u0000"
            }
         }
      ],
      "sumPhotos": 6
   },
   "isChild": false
}```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
### 0.0.2 
* Features
  * Exif data are available to the tempate, if the exif-parser module is present.
  * Modifications of the data's structure.
  * Total photo number is available to the tempate.
  * Do not create empty gallery.
  * Metadata files are used in a generic way.
  * Add debug option.
* Technical
  * Use more grunt functions.
  * Use node functions for path manipulation.

### 0.0.1
* Initial release
