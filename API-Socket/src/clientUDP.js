const dgram  = require('dgram');

server = {
	host: 'localhost',
	port: 3000
};


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

	process.stdin.on('data', function(chunk) {
		var message = chunk.toString().replace(/\n|\n/g, '');
		var object  =  message;
		var buffer  = Buffer.from(object);
	 	client.send(buffer, 0, buffer.length, server.port, server.host);
	});

}


client.on('listening', function() {
	var buffer = Buffer.from(`Novo cliente conectado no socket ${client.address().port}`);
	client.send(buffer, 0, buffer.length, server.port, server.host);
	console.log('Você esta conectado no socket %d.', client.address().port);
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

