module.exports = function(grunt) {
  require('time-grunt')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
          all: ['Gruntfile.js', 'app/**/*.js']
        },

        ngAnnotate: {
          options: {
              singleQuotes: true,
          },
          status: {
              files: {
                  // 'app/**/*.js': ['app/**/*.js']
              }
          }
        },
        
        concat: {
          options: {
            separator: '',
          },
          vendor: {
            src: ['resources/js/vendor/jquery.min.js', 'resources/js/vendor/angular/angular.js', 'resources/js/vendor/angular-ui-router/release/angular-ui-router.js', 'resources/js/vendor/wpbootstrap/wp.bootstrap.min.js'],
            dest: 'dist/tmp/js/vendor.concat.js',
          },
          common: {
            src: ['app/common/index/url.module.js', 'app/common/index/js/url.controller.js', 'app/common/index/js/url.service.js', 'app/common/index/js/date.ctrl.js', 'app/common/components/analytics/analytics.module.js', 'app/common/components/analytics/analytics.service.js', 'app/common/components/analytics/analyticsConfig.service.js'],
            dest: 'dist/tmp/js/common.concat.js',
          },
          resetpass:{
            src: 'app/common/components/reset-password/js/resetPassword.directive.js',
            dest: 'dist/tmp/js/resetpass.concat.js',
          },
          sessionidle:{
            src: ['app/common/components/session-idle/js/sessionIdle.module.js', 'app/common/components/session-idle/js/sessionIdle.directive.js', 'app/common/components/session-idle/js/sessionIdle.service.js'],
            dest: 'dist/tmp/js/sessionidle.concat.js',
          },
          wpdropdown:{
            src: 'app/common/components/wp-dropdown/js/wpDropdown.directive.js',
            dest: 'dist/tmp/js/wpdropdown.concat.js',
          },
          SQ: {
            src: ['app/SQ/app.js', 'app/SQ/js/accountdisabled.ctrl.js', 'app/SQ/js/securityquestions.ctrl.js', 'app/SQ/js/securityquestions.serv.js'],
            dest: 'dist/tmp/js/sq.concat.js',
          },
          USU: {
            src: ['app/USU/app.js', 'app/USU/js/setupsuccess.ctrl.js', 'app/USU/js/usersetup.ctrl.js', 'app/USU/js/usersetup.serv.js'],
            dest: 'dist/tmp/js/usu.concat.js',
          },
          CNPW: {
            src: ['app/CNPW/app.js', 'app/CNPW/js/cnpw.ctrl.js', 'app/CNPW/js/cnpw.serv.js'],
            dest: 'dist/tmp/js/cnpw.concat.js',
          },
          status: {
            src: ['app/common/status-pages/js/status.module.js', 'app/common/status-pages/js/status.ctrl.js', 'app/common/status-pages/js/status.serv.js'],
            dest: 'dist/tmp/js/status.concat.js',
          },

          csscommon:{
            src: ['resources/css/app/SSOTemplate.css', 'app/common/components/loading/css/loading.css', 'app/common/components/session-idle/css/sessionIdle.css'],
            dest: 'dist/tmp/css/common.concat.css',
          }

        },

        copy:{
          images: {
            expand: true,
            cwd: 'resources/assets/',
            src: ['images/*', '!**/dist/**'], dest: 'dist/resources/'
          },
          bootstrap: {
            expand: true,
            cwd:'resources/',
            src: ['css/vendor/wpbootstrap/wp.bootstrap.min.css'], dest: 'dist/resources/'
          },
          bootstrapfonts: {
            expand: true,
            cwd:'resources/',
            src: ['css/vendor/fonts/*'], dest: 'dist/resources/'
          },
          config: {
            expand: true,
            cwd: 'app/',
            src: ['**/*.json', '!**/dist/**'], dest: 'dist/'
          },
          templates: {
            expand: true,
            cwd: 'app/',
            src: ['**/*.html', '!**/dist/**'], dest: 'dist/'
          }
        },

        cssmin: {
          sq:{
            src: ['dist/tmp/css/common.concat.css', 'app/SQ/css/*.css'],
            dest: 'dist/SQ/css/sq.min.css',
          },
          usu:{
            src: ['resources/css/vendor/angular-material/angular-material.min.css', 'dist/tmp/css/common.concat.css', 'app/common/components/reset-password/css/resetPassword.css', 'app/common/components/wp-dropdown/css/wpDropdown.css', 'app/USU/css/*.css'],
            dest: 'dist/USU/css/usu.min.css',
          },
          cnpw:{
            src: ['resources/css/vendor/angular-material/angular-material.min.css', 'dist/tmp/css/common.concat.css', 'app/common/components/reset-password/css/resetPassword.css', 'app/CNPW/css/*.css'],
            dest: 'dist/CNPW/css/cnpw.min.css',
          },
          status:{
            src: ['resources/css/app/SSOTemplate.css', 'app/common/status-pages/css/statuspages.css'],
            dest: 'dist/common/status-pages/css/status.min.css',
          }
        },

        uglify: {
          options: {
            mangle: true
          },
          // build: {
          //   src: ['dist/js/vendor.concat.js', 'dist/js/common.concat.js', 'dist/js/status.concat.js'],
          //   dest: 'dist/js/status.min.js'
          // },
          // vendor: {
          //   src: 'dist/tmp/js/vendor.concat.js',
          //   dest: 'dist/tmp/js/vendor.min.js'
          // },
          // common: {
          //   src: 'dist/tmp/js/common.concat.js',
          //   dest: 'dist/js/common.min.js'
          // },
          sq:{
            src: ['dist/tmp/js/vendor.concat.js', 'dist/tmp/js/common.concat.js', 'dist/tmp/js/sessionidle.concat.js', 'dist/tmp/js/sq.concat.js'],
            dest: 'dist/SQ/js/sq.min.js'
          },
          usu:{
            src: ['dist/tmp/js/vendor.concat.js', 'resources/js/vendor/angular-material/angular-material.min.js',  'resources/js/vendor/angular/angular-animate.min.js', 'resources/js/vendor/angular/angular-aria.min.js', 'resources/js/vendor/angular/angular-messages.min.js', 'dist/tmp/js/common.concat.js', 'dist/tmp/js/sessionidle.concat.js', 'dist/tmp/js/resetpass.concat.js', 'dist/tmp/js/wpdropdown.concat.js', 'dist/tmp/js/usu.concat.js'],
            dest: 'dist/USU/js/usu.min.js'
          },
          cnpw:{
            src: ['dist/tmp/js/vendor.concat.js', 'resources/js/vendor/angular-material/angular-material.min.js',  'resources/js/vendor/angular/angular-animate.min.js', 'resources/js/vendor/angular/angular-aria.min.js', 'resources/js/vendor/angular/angular-messages.min.js', 'dist/tmp/js/common.concat.js', 'dist/tmp/js/sessionidle.concat.js', 'dist/tmp/js/resetpass.concat.js', 'dist/tmp/js/cnpw.concat.js'],
            dest: 'dist/CNPW/js/cnpw.min.js'
          },
          status:{
            src: ['dist/tmp/js/vendor.concat.js', 'dist/tmp/js/common.concat.js', 'dist/tmp/js/status.concat.js'],
            dest: 'dist/common/status-pages/js/status.min.js'
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
              'dist/SQ/index.html': ['app/SQ/index.html'],
              'dist/USU/index.html': ['app/USU/index.html'],
              'dist/CNPW/index.html': ['app/CNPW/index.html'],
              'dist/common/status-pages/index.html': ['app/common/status-pages/index.html'],
            }
          },
          sq: {
            files: {
              'dist/SQ/index.html': ['app/SQ/index.html'],
              'dist/common/status-pages/index.html': ['app/common/status-pages/index.html'],
            }
          },
          usu: {
            files: {
              'dist/USU/index.html': ['app/USU/index.html'],
              'dist/common/status-pages/index.html': ['app/common/status-pages/index.html'],
            }
          },
          cnpw: {
            files: {
              'dist/CNPW/index.html': ['app/CNPW/index.html'],
              'dist/common/status-pages/index.html': ['app/common/status-pages/index.html'],
            }
          }
        },

        compress: {
          main: {
            options: {
              archive: 'dist/sso-dist.zip'
            },
            files: [
              {expand: true, cwd: 'dist/', src: ['**'], dest: '/'}, // makes all src relative to cwd
            ]
          }
        },

        /*
        * Build a WAR (web archive) without Maven or the JVM installed.
        */
        war: {
          target: {
            options: {
              war_dist_folder: 'dist/',    /* Folder where to generate the WAR. */
              war_name: 'sso-dist'                    /* The name fo the WAR file (.war will be the extension) */
            },
            files: [
              {
                expand: true,
                cwd: 'dist',
                src: ['**'],
                dest: ''
              }
            ]
          }
        },

        clean:{
          dist:['dist'],
          tmp:['dist/tmp'],
          sq:['dist/SQ'],
          usu:['dist/USU'],
          cnpw:['dist/CNPW'],
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-war');
    

    grunt.registerTask('default', ['clean:dist', 'jshint', 'ngAnnotate', 'concat', 'copy', 'uglify', 'cssmin', 'processhtml', 'compress', 'clean:tmp', 'war']);
    grunt.registerTask('sq', ['clean:sq', 'jshint', 'ngAnnotate', 'concat', 'copy', 'uglify:sq', 'cssmin:sq', 'cssmin:status', 'processhtml:sq', 'clean:tmp']);
    grunt.registerTask('usu', ['clean:usu', 'jshint', 'ngAnnotate', 'concat', 'copy', 'uglify:usu', 'cssmin:usu', 'cssmin:status', 'processhtml:usu', 'clean:tmp']);
    grunt.registerTask('cnpw', ['clean:cnpw', 'jshint', 'ngAnnotate', 'concat', 'copy', 'uglify:cnpw', 'cssmin:cnpw', 'cssmin:status', 'processhtml:cnpw', 'clean:tmp']);

};