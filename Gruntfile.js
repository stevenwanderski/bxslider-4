/**
 * bxSlider
 *
 * Steven Wanderski
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */
module.exports = function(grunt) {

  var path = require('path');

  if (!grunt.file.isDir('bower_components')) {
    grunt.fail.fatal('>> Please run "bower install" before continuing.');
  }
  require('load-grunt-tasks')(grunt);

  grunt
    .initConfig({
      pkg: grunt.file.readJSON('package.json'),
      app: grunt.file.readJSON('_config.json'),
      vendor: 'bower_components',

      // assemble
      assemble: {
        options: {
          flatten: false,
          expand: true,
          production: false,
          assets: '<%= app.docs.dest %>/assets',
          postprocess: require('pretty'),
          mybaseDir: path.resolve('<%= app.docs.dest %>'),

          // metadata
          pkg: '<%= pkg %>',
          app: '<%= app %>',
          data: ['<%= app.docs.src %>/data/*.{json,yml}'],
          helpers: ['handlebars-helpers'],

          // templates
          partials: '<%= app.docs.templates %>/partials/*.hbs',
          layoutdir: '<%= app.docs.layouts %>/'
        },
        index: {
          options: {
            layout: 'home.hbs'
          },
          files: [{
            expand: true,
            cwd: '<%= app.docs.pages %>/',
            src: '*.hbs',
            dest: '<%= app.docs.dest %>/'
          }]
        },
        demos: {
          options: {
            layout: 'demos.hbs'
          },
          files: [{
            expand: true,
            cwd: '<%= app.docs.pages %>/demos/',
            src: '*.hbs',
            dest: '<%= app.docs.dest %>/demos'
          }]
        },
        docs: {
          options: {
            layout: 'docs.hbs'
          },
          files: [{
            expand: true,
            cwd: '<%= app.docs.pages %>/docs/',
            src: '*.hbs',
            dest: '<%= app.docs.dest %>/docs'
          }]
        }
      },

      // clean
      clean: {
        docs: ['<%= app.docs.dest %>/**/*.*'],
        dist: ['dist/**/*.*']
      },

      // less
      less: {
        docs: {
          options: {
            compress: true,
            paths: ['<%= app.docs.src %>/assets/less/', 'bower_components/bootstrap/less/']
          },
          files: {
            '<%= app.docs.dest %>/assets/css/docs.min.css': '<%= app.docs.src %>/assets/less/docs.less'
          }
        },
        dist: {
          options: {
            compress: false
          },
          files: [{
            expand: true,
            flatten: true,
            cwd: 'src/less/',
            src: '*less',
            dest: 'src/css/',
            ext: '.css',
            extDot: 'last'
          }]
        }
      },

      // concat
      concat: {
        docs: {
          src: [
            'bower_components/bootstrap/js/transition.js',
            'bower_components/bootstrap/js/alert.js',
            'bower_components/bootstrap/js/button.js',
            'bower_components/bootstrap/js/carousel.js',
            'bower_components/bootstrap/js/collapse.js',
            'bower_components/bootstrap/js/dropdown.js',
            'bower_components/bootstrap/js/modal.js',
            'bower_components/bootstrap/js/tooltip.js',
            'bower_components/bootstrap/js/popover.js',
            'bower_components/bootstrap/js/scrollspy.js',
            'bower_components/bootstrap/js/tab.js',
            'bower_components/bootstrap/js/affix.js',
            'bower_components/highlightjs/highlight.pack.js'
          ],
          dest: '<%= app.docs.dest %>/assets/js/vendor.js'
        },
        dist: {
          options: {
            banner: '/**\n' + ' * bxSlider v<%= pkg.version %>\n' +
              ' * Copyright 2013-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
              ' * Written while drinking Belgian ales and listening to jazz\n\n' +
              ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' + ' */\n\n'
          },
          files: {
            'dist/jquery.<%= pkg.name %>.css': ['src/css/*.css'],
            'dist/jquery.<%= pkg.name %>.js': '<%= app.src.scripts %>'
          }
        }
      },

      cssmin: {
        options: {
          banner: '/**\n' + ' * bxSlider v<%= pkg.version %>\n' +
            ' * Copyright 2013-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
            ' * Written while drinking Belgian ales and listening to jazz\n\n' +
            ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' + ' */\n\n'
        },
        dist: {
          files: {
            'dist/jquery.<%= pkg.name %>.min.css': ['src/css/*.css']
          }
        }
      },

      // jshint
      jshint: {
        options: {
          jshintrc: 'src/js/.jshintrc'
        },
        dist: {
          src: ['<%= app.src.scripts %>', 'Gruntfile.js']
        }
      },

      //jscs
      jscs: {
        options: {
          config: 'src/js/.jscsrc',
          reporter: 'text.js',
          reporterOutput: 'jscs.report.txt'
        },
        dist: {
          src: ['<%= app.src.scripts %>', 'Gruntfile.js']
        }
      },

      // uglify
      uglify: {
        options: {
          banner: '/**\n' + ' * bxSlider v<%= pkg.version %>\n' +
            ' * Copyright 2013-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
            ' * Written while drinking Belgian ales and listening to jazz\n\n' +
            ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' + ' */\n\n'
        },
        dist: {
          files: {
            'dist/jquery.<%= pkg.name %>.min.js': '<%= app.src.scripts %>'
          }
        }
      },

      // copy
      copy: {
        distImages: {
          expand: true,
          flatten: true,
          cwd: 'src/',
          src: ['images/*.*'],
          dest: 'dist/images'
        },

        distVendor: {
          expand: true,
          flatten: true,
          cwd: 'src/',
          src: ['vendor/*.*'],
          dest: 'dist/vendor'
        },

        distToDocs: {
          expand: true,
          cwd: 'dist/',
          src: ['**/*.*'],
          dest: '<%= app.docs.dest %>/assets/bxslider'
        },

        srcToDocs: {
          expand: true,
          cwd: 'src/js',
          src: ['**/*.js'],
          dest: '<%= app.docs.dest %>/assets/bxslider/src'
        },

        docsAssets: {
          expand: true,
          cwd: '<%= app.docs.src %>/assets/',
          src: ['css/*.css', 'vendors/*.js', 'vendors/*.map', 'img/*.*', 'js/*.*'],
          dest: '<%= app.docs.dest %>/assets/'
        },

        docsHighlightAssets: {
          expand: true,
          cwd: 'bower_components/highlightjs/',
          src: 'styles/*.css',
          dest: '<%= app.docs.dest %>/assets/css/'
        },

        readme: {
          files: [{
            'dist/LICENSE.md': 'LICENSE.md',
            'dist/README.md': 'README.md'
          }]
        }
      },

      // connect
      connect: {
        options: {
          port: 9000,
          open: true,
          livereload: true,
          hostname: 'localhost'
        },
        docs: {
          options: {
            base: '<%= app.docs.dest %>'
          }
        }
      },

      // watch
      watch: {
        options: {
          livereload: true
        },
        templates: {
          files: ['<%= app.docs.templates %>/**/*.hbs'],
          tasks: ['assemble']
        },
        less: {
          files: ['<%= app.docs.src %>/assets/**/*.less'],
          tasks: ['less:docs']
        },
        lessDist: {
          files: ['src/**/*.less'],
          tasks: ['less:dist', 'concat:dist', 'cssmin:dist', 'copy:distToDocs']
        },
        jsDocs: {
          files: ['<%= app.docs.src %>/assets/**/*.js'],
          tasks: ['copy:docsAssets']
        },
        js: {
          files: ['src/**/*.js'],
          tasks: ['jscs:dist', 'jshint:dist', 'uglify:dist', 'concat:dist', 'copy:distToDocs', 'copy:srcToDocs']
        },
        helpers: {
          files: ['<%= app.src %>/helpers/*.js'],
          tasks: ['assemble']
        }
      },

      // compress zip
      compress: {
        zip: {
          options: {
            archive: 'download/<%= pkg.version %>/bxslider.zip'
          },
          files: [{
            expand: true,
            cwd: 'dist/',
            src: ['**'],
            dest: 'bxslider.<%= pkg.version %>'
          }]
        }
      }
    });

  grunt.loadNpmTasks('assemble');

  // tasks
  grunt.registerTask('dist', ['clean:dist', 'less:dist', 'jshint:dist', 'concat:dist', 'cssmin:dist', 'copy:distImages', 'copy:distVendor', 'jscs:dist', 'uglify:dist', 'copy:readme']);

  grunt.registerTask('docs', ['clean:docs', 'assemble', 'less:docs', 'concat:docs', 'copy:docsAssets', 'copy:docsHighlightAssets', 'copy:distToDocs']);

  grunt.registerTask('default', ['dist', 'docs']);

  grunt.registerTask('watch', ['connect:docs', 'watch']);

  grunt.registerTask('zip', ['compress']);

};
