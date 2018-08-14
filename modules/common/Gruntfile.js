module.exports = function(grunt) {
	// load grunt tasks based on dependencies in package.json
	require('load-grunt-tasks')(grunt);

	grunt.config.init({
	  useminPrepare: {
	      html: 'index.html',
	      options: {
	        dest: 'dist'
	      }
	  },
	  usemin:{
	  	html:['dist/index.html']
	  },
	  copy:{
	    html: {
	    	src: './index.html', dest: 'dist/index.html'
	    }
	  }
	});

	grunt.registerTask('default',[
		'copy:html',
		'useminPrepare',
		'concat',
		'uglify',
		'cssmin',
		'usemin'
    ]);
}