module.exports = function(grunt) {
	// load grunt tasks based on dependencies in package.json
	require('load-grunt-tasks')(grunt);

	grunt.config.init({

		// babel: {
		// 	options: {
		// 		sourceMap: true
		// 	},
		// 	dist: {
		// 		files: {
		// 			'dist/app.js': '../common/error-pages/views/error-pages/error.ctrl.js'
		// 		}
		// 	}
		// },

	  useminPrepare: {
	      html: 'index.html',
	      options: {
	        dest: 'dist'
	      }
	  },
	  usemin:{
	  	html:['./dist/index.html']
	  },
	  copy:{
			index: {
				src: 'index.html', dest: './distt/index.html'
			},
			sq: {
				src: 'views/security-questions/*.html', dest: 'dist/views/security-questions/securityquestions.html'
			},
			ad: {
				src: 'views/account-disabled/*.html', dest: 'dist/views/account-disabled/accountdisabled.html'
			},
			header: {
				src: 'views/header.html', dest: 'dist/views/header.html'
			},
			footer: {
				src: 'views/footer.html', dest: 'dist/views/footer.html'
			},
			appjs: {
				src: 'scripts/app.js', dest: 'dist/js/app.js'
			}
	  },
		concat: {
			dist: {
				src: ['scripts/app.js', 'views/securityquestions.ctrl.js', 'views/securityquestions.serv.js'],
				dest: 'dist/js/securityquestionsss.min.js',
			},
  	},
		clean:{
			tmp:['.tmp']
		}
	});

	grunt.registerTask('default',[
		
		'copy:index',
		'copy:sq',
		'copy:ad',
		'copy:header',
		'copy:footer',
		'useminPrepare',
		'concat',
		'uglify',
		'cssmin',
		'usemin',
		'copy:index',
		'clean'
    ]);
}
