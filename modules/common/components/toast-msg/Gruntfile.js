module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        concat: {
          options: {
            separator: '',
          },
          dist: {
            src: ['scripts/app.js', 'views/security-questions/securityquestions.ctrl.js', 'views/security-questions/securityquestions.serv.js', 'views/account-disabled/accountdisabled.ctrl.js'],
            dest: 'dist/sq.concat.js',
          },
        },

        cssmin: {
          build: {
            src: "views/**/*.css",
            dest: "dist/css/securityquestions.min.css"
          }
        },

        uglify: {
          options: {
            mangle: true
          },
          build: {
            src: "dist/sq.concat.js",
            dest: "dist/js/securityquestions.min.js"
          }
        }

    });


    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask('default', ["concat", "uglify", "cssmin"]);

};