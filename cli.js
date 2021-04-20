#!/usr/bin/env node
const program = require('commander')
const pkg = require('./package.json')
const api = require('./index.js')

program
    .version(pkg.version)
program
    .command('add')
    .description('add a task')
    .action((...args) => {
        const words = args.slice(0, -1).join(' ')
        api.add(words).then(() => {
            void api.showAll()
        }, (error) => {
            throw new Error(error);
        })
    })
program
    .command('clear')
    .description('clear all tasks')
    .action(() => {
        api.clear().then(() => {
            void api.showAll()
        }, (error) => {
            throw new Error(error);
        })
    })

program.parse(process.argv)

if (process.argv.length === 2) {
    // 说明用户直接运行 node cli.js
    void api.showAll()
}