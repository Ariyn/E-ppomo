module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			all: ['test.js', 'main.js', "tests/vis.js"],
			options: {
				jshintrc:".jshintrc"
			}
		},
		qunit: {
			all:["html/test.html"]
		}
	});
	grunt.registerTask('check', ["jshint"]);
	grunt.registerTask('test', ["qunit"]);

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
}
// grunt.initConfig({
//     pkg: grunt.file.readJSON('package.json'),
//     uglify: {
//       options: {
//         banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
//       },
//       build: {
//         src: 'src/<%= pkg.name %>.js',
//         dest: 'build/<%= pkg.name %>.min.js'
//       }
//     }
//   });
//
//   // Load the plugin that provides the "uglify" task.
//   grunt.loadNpmTasks('grunt-contrib-uglify');
//
//   // Default task(s).
//   grunt.registerTask('default', ['uglify']);

// grunt.initConfig({
//   concat: {
//     //
//     // js 디렉토리에 application.js 생성
//     // syntax:
//     //    from: to(array)
//     //
//     'js/application.js': ['js/global.js', 'js/util.js'],
//     //
//     // css 도 합친다.
//     // syntax:
//     //    from: to(array)
//     //
//     'css/application.css': ['css/*']
//     //
//     // 메뉴얼에 아래와 같이 하란다.
//     // 아래와 같이 해도 된다.
//     //
//     /*dist: {
//       src: ['js/global.js', 'js/util.js'],
//       dest: 'js/application.js'
//     }*/
//   }
// });
