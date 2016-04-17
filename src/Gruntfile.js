module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			all: ['test.js', 'main.js', "tests/vis.js",
				"Scripts/api.js", "Scripts/ls.js", "Scripts/main.js","Scripts/visualizer.js",
				"NScripts/*.js"],
			options: {
				jshintrc:".jshintrc"
			}
		},
		electron: {
			osxBuild: {
				options: {
					name: 'ppomodoro',
					dir: 'app',
					out: 'dist',
					version: '0.25.3',
					platform: 'darwin',
					arch: 'x64'
				}
			},
			"win-x64": {
				options: {
					name: 'ppomodoro',
					dir:"C:\\Users\\ariyn\\Documents\\E-ppomo",
					platform:"win32",
					arch:"x64",
					version:"0.37.3"
				}
			}
		},
		'create-windows-installer': {
			x64: {
				appDirectory: 'C:\\Users\\ariyn\\Documents\\E-ppomo',
				authors: 'Mutopia',
				description:"ppomodoro app",
				exe: 'myapp.exe'
			},
		}
	});
	grunt.registerTask('check', ["jshint"]);
	grunt.registerTask('run', ["jshint", "batch"]);
	// grunt.registerTask('build-64', ["jshint", "create-windows-installer:x64"]);
	// grunt.registerTask('build-64', ["jshint", "electron:win-x64"]);

	grunt.loadNpmTasks('grunt-contrib-jshint');
	// grunt.loadNpmTasks('grunt-batch');
	// grunt.loadNpmTasks('grunt-contrib-commands');
	// grunt.loadNpmTasks('grunt-electron-installer')
	// grunt.loadNpmTasks('grunt-electron')
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
