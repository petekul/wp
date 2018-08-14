module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
          all: ['Gruntfile.js', 'js/**/*.js']
        },

        ngAnnotate: {
          options: {
              singleQuotes: true,
          },
          status: {
              files: {
                  'js/status.module.js': ['js/status.module.js']
              }
          }
        },
        concat: {
          options: {
            separator: '',
          },
          config: {
            src: 'configs/statusconfig.json',
            dest: 'dist/configs/statusconfig.json'
          },
          vendor: {
            src: ['../../../resources/js/vendor/jquery.min.js', '../../../resources/js/vendor/angular/angular.js', '../../../resources/js/vendor/angular-ui-router/release/angular-ui-router.js', '../../../resources/js/vendor/wpbootstrap/wp.bootstrap.min.js'],
            dest: 'dist/js/vendor.concat.js',
          },
          common: {
            src: ['../index/url.module.js', '../index/js/url.controller.js', '../index/js/url.service.js', '../index/js/date.ctrl.js', '../components/analytics/analytics.module.js', '../components/analytics/analytics.service.js', '../components/analytics/analyticsConfig.service.js'],
            dest: 'dist/js/common.concat.js',
          },
          status: {
            src: ['js/status.module.js', 'js/status.ctrl.js', 'js/status.serv.js'],
            dest: 'dist/js/status.concat.js',
          },
        },

        copy:{
          index: {
            src: 'index.html', dest: 'dist/index.html'
          },
          templates: {
            src: 'templates/**', dest: 'dist/'
          },
          commontemplates:{
            expand: true,
            cwd: '../index/templates',
            src: ['**'], dest:'dist/templates/'
          }
        },

        cssmin: {
          build: {
            src: ['../../../resources/css/vendor/wpbootstrap/wp.bootstrap.min.css', '../../../resources/css/app/SSOTemplate.css', '**/statuspages.css'],
            dest: 'dist/css/status.min.css'
          }
        },

        uglify: {
          options: {
            mangle: true
          },
          build: {
            src: ['dist/js/vendor.concat.js', 'dist/js/common.concat.js', 'dist/js/status.concat.js'],
            dest: 'dist/js/status.min.js'
          },
          vendor: {
            src: 'dist/js/common.concat.js',
            dest: 'dist/js/common.min.js'
          },
          common: {
            src: 'dist/js/vendor.concat.js',
            dest: 'dist/js/vendor.min.js'
          }
        },

        clean:{
          dist:['dist']
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-ng-annotate');

    grunt.registerTask('default', ['clean', 'jshint', 'ngAnnotate', 'concat', 'copy', 'uglify:build', 'cssmin']);

};