module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        concat: {
          options: {
            separator: '',
          },
          dist: {
            src: ['views/error-pages/error.module.js', 'views/error-pages/error.ctrl.js', 'views/error-pages/error.serv.js'],
            dest: 'dist/error.concat.js',
          },
        },

        cssmin: {
          build: {
            src: "views/**/*.css",
            dest: "dist/css/errorpages.min.css"
          }
        },

        uglify: {
          options: {
            mangle: true
          },
          build: {
            src: "dist/error.concat.js",
            dest: "dist/js/errorpages.min.js"
          }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask('default', ["concat", "uglify", "cssmin"]);

};