const net = require('net')
const conf = require('./config/config')
const readline = require('readline') 

const client = new net.Socket()
const host = '127.0.0.1'
const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

client.connect(conf.port, host, function() {
    console.log('Bem-Vindo, querido padawan do IF!')
    rl.addListener('line', line => {
        client.write(line + ' ')
    })
})
