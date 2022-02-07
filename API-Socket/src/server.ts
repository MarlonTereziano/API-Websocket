import { app } from './app';

const PORTA = 3000;

/* Servidor UDP*/ 

const dgram = require('dgram');
const fs = require('fs');

const server = dgram.createSocket('udp4');
server.bind({
  address: 'localhost',
  port: PORTA
});



server.on('listening', () => {
  console.log(`server escutando ${server.address().address}: ${server.address().port}`);
});

server.on('message', (msg, rinfo) => {
  console.log(`${rinfo.family} - ${rinfo.address}:${rinfo.port} > ${msg}`);
  var mensagem = " " + rinfo.family + "-" + rinfo.address + ":" + rinfo.port + ">" + msg;
  escreveArquivo(mensagem);
});


server.on('close', () => {
  console.log('socket fechado');
})

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});


function escreveArquivo(msg) {

  const CreateFiles = fs.createWriteStream('./historico.txt', {
    flags: 'a'
  })

  CreateFiles.write(msg + '\r\n') //'\r\n at the end of each value

}

/* Servidor Express*/

const server2 = app.listen(3010, () => console.log(`App ouvindo na porta ${3010}`));

process.on('SIGINT', () => {
    server2.close();
    console.log('App finalizado');
});

/* Servidor TCP*/

const net = require('net')
const conf = require('./config/config')

const {
	log
} = require('./util/loggerTool')

const server3 = net.createServer()

const sockets = []
server3.on('connection', sock => {

	sockets.push(sock)

	sock.on('data', data => {

		log("tcp_server", "info", data.toString())

		const response = data.toString()
		const dataBuffer = Buffer.from(JSON.stringify(response))

		sockets.forEach((sock) => {
			sock.write(dataBuffer)
		})
	})

	sock.on('close', () => {
		log("tcp_server", "info", `Socket closed with ${sock.remoteAddress}:${sock.remotePort}`)
	})
	sock.on('end', () => {
		console.log('Socket ended')
	})
})


server3.listen(conf.port, conf.serverHost, () => {
	const address = server3.address()
	const port = address.port
	const family = address.family
	const ipaddr = address.address

	log( "info", 'Server is listening at port ' + port)
	log( "info", 'Server ip :' + ipaddr)
	log( "info", 'Server is IP4/IP6 : ' + family)
})	