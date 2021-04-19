const program = require('commander')
const pkg = require('./package.json')

program
    .version(pkg.version)
program
    .command('add')
    .description('add a task')
    .action((...args) => {
        console.log(args, 'args')
    })

program.parse(process.argv)