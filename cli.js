#!/usr/bin/env node
const program = require('commander')
const pkg = require('./package.json')
const api = require('./index.js')

program
    .version(pkg.version)
program
    .command('add')
    .description('add a task')
    .action((args) => {
        console.log(args, 'args')
        const words = args.slice(0, -1).join(' ')
        api.add(words).then(() => {
            console.log('添加成功')
        }, () => {
            console.log('添加失败')
        })
    })
program
    .command('clear')
    .description('clear all tasks')
    .action(() => {
        api.clear().then(() => {
            console.log('清除完毕')
        }, () => {
            console.log('清除失败')
        })
    })
console.log(process.argv, 'process.argv')
program.parse(process.argv)

if (process.argv.length === 2) {
    // 说明用户直接运行 node cli.js
    void api.showAll()
}