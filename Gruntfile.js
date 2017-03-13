module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      files: ['src/**/*.js'],
      options: {
        globals: {
          jQuery: true
        },
		ignores:['src/components/**'],
		reporter: require('jshint-stylish'),
		force: true,
		"-W099": true,
		"-W100":true
      }
    },
	update_json: {
		options: {
		  indent: '\t'
		},
		
		manifest : {
		  src: 'manifest.json',
		  dest: 'manifest.json',      // where to write to 
		  fields: {                    // the fields to update 
				version:"bla!"
		  }
		 }
	},
	compress: {
		main: {
			options: {
			  archive: 'plussub.zip'
			},
			files: [
			  {src: ['src/**','res/**','manifest.json'], dest: '/'} // includes files in path and its subdirs
			]
		  }
	}
  });
  //
  //grunt.loadNpmTasks('grunt-contrib-jshint');
  //grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-update-json');
  grunt.loadNpmTasks('grunt-contrib-compress');
  
  var fs = require('fs');
  grunt.registerTask('update-chrome-extension-manifest', function() {
		var manifest = require('./manifest.json');
		grunt.log.ok('Old version: '+manifest.version);
		manifest.version=""+(parseFloat(manifest.version)+0.01).toFixed(2);;
		grunt.log.ok('New version: '+manifest.version);
	    fs.writeFileSync('./manifest.json', JSON.stringify(manifest,null,2));
  });
  
  grunt.registerTask('default', ['update-chrome-extension-manifest','compress']);

};