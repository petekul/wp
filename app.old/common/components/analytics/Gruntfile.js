module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        cssmin: {
          build: {
            src: "**/*.css",
            dest: "dist/css/analytics.min.css"
          }
        },

        uglify: {
          options: {
            mangle: true
          },
          build: {
            src: "**/*.js",
            dest: "dist/js/analytics.min.js"
          }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask('default', ["uglify", "cssmin"]);

};