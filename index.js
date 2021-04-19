const db = require('./db.js')
const inquirer = require('inquirer')

module.exports.add = async (title) => {
    // 读取之前的任务
    const list = await db.read();
    // 往里面添加一个title任务
    list.push({title, done: false})
    // 储存任务到文件
    await db.write(list);
}

module.exports.clear = async () => {
    await db.write([])
}

function markAsDone(list, index) {
    list[index].done = true
    db.write(list)
}

function markAsUndone(list, index) {
    list[index].done = false;
    db.write(list)
}

function updateTitle(list, index) {
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: '新的标题',
        default: list[index].title
    }).then(answer => {
        list[index].title = answer.title
        db.write(list);
    })
}

function remove(list, index) {
    list.splice(index, 1)
    db.write(list)
}