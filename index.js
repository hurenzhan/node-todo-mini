const db = require('./db.js')
const inquirer = require('inquirer')

module.exports.add = async (title) => {
    // 读取之前的任务
    const list = await db.read();
    // 往里面添加一个title任务
    list.push({title, done: 0})
    // 储存任务到文件
    await db.write(list);
}

module.exports.clear = async () => {
    await db.write([])
}

async function markAsCancel(list, index) {
    list[index].done = '0'
    await db.write(list)
    printTasks(list);
}

async function markAsOn(list, index) {
    list[index].done = '1'
    await db.write(list)
    printTasks(list);
}

async function markAsDone(list, index) {
    list[index].done = '2'
    await db.write(list)
    printTasks(list);
}

async function markAsUndone(list, index) {
    list[index].done = '3';
    await db.write(list)
    printTasks(list);
}

async function updateTitle(list, index) {
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: '新的标题',
        default: list[index].title
    }).then(async answer => {
        list[index].title = answer.title
        await db.write(list)
        printTasks(list);
    })
}

async function remove(list, index) {
    list.splice(index, 1)
    await db.write(list)
    printTasks(list);
}

async function goBack(list) {
    printTasks(list);
}

function askForAction(list, index) {
    const actions = {markAsUndone, markAsOn, markAsDone, markAsCancel, remove, updateTitle, goBack}
    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: '请选择操作',
        choices: [
            {name: '上一步', value: 'goBack'},
            {name: '已完成', value: 'markAsDone'},
            {name: '进行中', value: 'markAsOn'},
            {name: '未完成', value: 'markAsUndone'},
            {name: '取消', value: 'markAsCancel'},
            {name: '改标题', value: 'updateTitle'},
            {name: '删除', value: 'remove'},
        ]
    }).then(answer => {
        const action = actions[answer.action]
        action && action(list, index)
    })
}

function askForCreateTask(list) {
    inquirer.prompt({
        type: 'index',
        name: 'title',
        message: '请输入任务标题'
    }).then(async answer => {
        list.push({
            title: answer.title,
            done: '0'
        })
        await db.write(list);
        printTasks(list);
    })
}

function getStatusIcon(done) {
    const icons = {
        0: '[ ]',
        1: '[□]',
        2: '[√]',
        3: '[x]',
    }
    return icons[done]
}

function printTasks(list) {
    inquirer
        .prompt({
            type: 'list',
            name: 'index',
            message: '请选择你想操作的任务',
            choices: [
                {name: '退出', value: '-1'},
                ...list.map((task, index) => (
                    {
                        name: `${getStatusIcon(task.done)} ${index + 1} - ${task.title}`,
                        value: index.toString()
                    }
                )),
                {name: '+ 创建任务', value: '-2'}
            ]
        })
        .then(answer => {
            const index = parseInt(answer.index)
            if (index >= 0) {
                askForAction(list, index)
            } else if (index === -2) {
                askForCreateTask(list)
            }
        })
}

module.exports.showAll = async () => {
    // 读取之前的任务
    const list = await db.read();
    // 打印之前的任务
    printTasks(list);
}