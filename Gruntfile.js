module.exports = function(grunt) {
    // 从 npm 载入任务
    grunt.loadNpmTasks("grunt-ts")
    var config = require('./.screeps.json')
    grunt.loadNpmTasks('grunt-contrib-watch');
    // 配置任务
    grunt.loadNpmTasks('grunt-screeps');
    grunt.initConfig({
        // typescripts 编译任务
        'ts': {
            default : {
                options: {
                    sourceMap: false,
                    // 编译到的目标版本
                    target: 'es6',
                    rootDir: "src/"
                },
                // 要进行编译的目录及文件
                src: ["src/*.ts"],
                // 编译好的文件的输出目录
                outDir: 'dist/'
            }
        },
        screeps: {
            options: {
                email: config.email,
                password: config.password,
                branch: config.branch,
                ptr: config.ptr
            },
            dist: {
                src: ['dist/*.{js,wasm}'],
            }
        },
        watch:{
            files: "src/*.*",
            tasks:['ts','screeps']
        }
    })
    // 将 ts 编译任务注册到默认执行命令
    grunt.registerTask('default',  [ 'watch' ])
}