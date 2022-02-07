const axios = require('axios').default;
const dgram  = require('dgram');
'use strict';

server = {
	host: 'localhost',
	port: 3000
};

var userLogged = null;
var client = dgram.createSocket('udp4', function(message) {
	
	console.log('%s', message.toString());
	process.stdin.resume();
	process.stdin.removeAllListeners('data');
	process.stdin.on('data', function(chunk) {
	 	Command();
	});

});

client.bind();

function Command() {

	process.stdin.on('data', async function(chunk) {
		var message = chunk.toString().replace(/\n|\n/g, '');
		var object  =  message;
		var buffer  = Buffer.from(object);
		if(message.trim() === '/deslogar'){
			userLogged = null;
			console.log('Deslogado com sucesso!');
			console.log('Faça login para continuar:');
			return;
		}
		if(!userLogged) {
			if(!parseInt(message)) {
				console.log("Digite um id numerico correto");
				return;
			}
			const result = await axios.get('http://localhost:3010/usuario');
			//find user id at resultai
			const user = result.data.find((user)=> user.id === parseInt(message));

			if(!user){
				console.warn("Digite um usuario valido:");
			}else{
				process.stdout.write('\033c\033[3J');
				console.log("Logado com sucesso!");
				console.log("####################################");
				console.log(`Seja bem vindo ${user.nome}!`);


				userLogged = user;
			}
		}else{
			buffer = Buffer.from(userLogged.nome + ": " + message);
			client.send(buffer, 0, buffer.length, server.port, server.host);
		}
	});

}


client.on('listening', function() {
	var buffer = Buffer.from(`Novo cliente conectado no socket ${client.address().port}`);
	client.send(buffer, 0, buffer.length, server.port, server.host);
	console.log('Você esta conectado no socket %d.', client.address().port);
	if(!userLogged) {
		console.log('Digite seu id:');
	}

});

client.on('error', function(err) {
	console.log(err);
});

client.on('close', function() {
	var buffer = Buffer.from('Cliente foi desconectado. ');
	client.send(buffer, 0, buffer.length, server.port, server.host);
	console.log('Cliente disconectado.', client.address().port);

})

process.stdin.resume();
Command();

