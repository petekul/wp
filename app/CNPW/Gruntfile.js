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
          cnpw: {
              files: {
                  'app.js': ['app.js'],
                  'js/cnpw.ctrl.js': ['js/cnpw.ctrl.js'],
                  'js/cnpw.serv.js': ['js/cnpw.serv.js']
              }
          }
        },
        concat: {
          options: {
            separator: '',
          },
          vendor: {
            src: ['../../resources/js/vendor/jquery.min.js', '../../resources/js/vendor/angular/angular.js', '../../resources/js/vendor/angular-material/angular-material.min.js',  '../../resources/js/vendor/angular/angular-animate.min.js', '../../resources/js/vendor/angular/angular-aria.min.js', '../../resources/js/vendor/angular/angular-messages.min.js', '../../resources/js/vendor/angular-ui-router/release/angular-ui-router.js', '../../resources/js/vendor/wpbootstrap/wp.bootstrap.min.js'],
            dest: 'tmp/js/vendor.concat.js',
          },
          common: {
            src: ['../common/index/url.module.js', '../common/index/js/url.controller.js', '../common/index/js/url.service.js', '../common/index/js/date.ctrl.js', '../common/components/analytics/analytics.module.js', '../common/components/analytics/analytics.service.js', '../common/components/analytics/analyticsConfig.service.js', '../common/components/session-idle/js/sessionIdle.module.js', '../common/components/session-idle/js/sessionIdle.directive.js', '../common/components/session-idle/js/sessionIdle.service.js', '../common/components/reset-password/js/resetPassword.directive.js'],
            dest: 'tmp/js/common.concat.js',
          },
          cnpw: {
            src: ['app.js', 'js/cnpw.ctrl.js', 'js/cnpw.serv.js'],
            dest: 'tmp/js/cnpw.concat.js',
          },
        },

        copy:{
          config: {
            src: 'config/**', dest: 'dist/'
          },
          templates: {
            src: 'templates/**', dest: 'dist/'
          },
          commontemplates:{
            expand: true,
            cwd: '../common/index/templates',
            src: ['**'], dest:'templates/'
          },
          commontemplatesdist:{
            expand: true,
            cwd: '../common/index/templates',
            src: ['**'], dest:'dist/templates/'
          }
        },

        cssmin: {
          build: {
            src: ['../../resources/css/vendor/angular-material/angular-material.min.css', '../../resources/css/app/SSOTemplate.css', '../common/components/loading/css/loading.css', '../common/components/reset-password/css/resetPassword.css', '../common/components/session-idle/css/sessionIdle.css', 'css/*.css'],
            dest: 'dist/css/cnpw.min.css'
          }
        },

        uglify: {
          options: {
            mangle: true
          },
          build: {
            src: ['tmp/js/vendor.concat.js', 'tmp/js/common.concat.js', 'tmp/js/cnpw.concat.js'],
            dest: 'dist/js/cnpw.min.js'
          },
          cnpw: {
            src: 'tmp/js/cnpw.concat.js',
            dest: 'dist/js/choosenewpassword.min.js'
          },
          vendor: {
            src: 'tmp/js/vendor.concat.js',
            dest: 'dist/js/vendor.min.js'
          },
          common: {
            src: 'tmp/js/common.concat.js',
            dest: 'dist/js/common.min.js'
          }
        },

        processhtml: {
          options: {
            data: {
              message: ''
            }
          },
          dist: {
            files: {
              'dist/index.html': ['index.html']
            }
          }
        },

        clean:{
          dist:['dist', 'tmp']
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-processhtml');

    grunt.registerTask('default', ['clean', 'jshint', 'ngAnnotate', 'concat', 'copy', 'uglify:build', 'cssmin', 'processhtml']);

};