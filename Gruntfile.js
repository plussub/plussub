module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            files: ['src/**/*.js'],
            options: {
                globals: {
                    jQuery: true
                },
                ignores: ['src/components/**'],
                reporter: require('jshint-stylish'),
                force: true,
                "-W099": true,
                "-W100": true
            }
        },
        update_json: {
            options: {
                indent: '\t'
            },

            manifest: {
                src: 'manifest.json',
                dest: 'manifest.json',      // where to write to
                fields: {                    // the fields to update
                    version: "bla!"
                }
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'plussub.zip'
                },
                files: [
                    {src: ['src/**', 'res/**', 'manifest.json'], dest: '/'} // includes files in path and its subdirs
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-update-json');
    grunt.loadNpmTasks('grunt-contrib-compress');

    let fs = require('fs');
    let git_rev = require('git-rev');

    grunt.registerTask('update-chrome-extension-manifest', function () {
        let done = this.async();

        let manifest = require('./manifest.json');
        grunt.log.ok(`Old version: ${manifest.version}`);

        git_rev.tag((tag)=>{
            grunt.log.ok(`New version: ${tag}`);
            fs.writeFileSync('./manifest.json', JSON.stringify(manifest, null, 2));
            done();
        });
    });

    grunt.registerTask('default',['githash','update-chrome-extension-manifest', 'compress']);

};