import { app } from './app';

const PORTA = 3000;

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

const server2 =
    app.listen(PORTA, () => console.log(`App ouvindo na porta ${PORTA}`));

process.on('SIGINT', () => {
    server2.close();
    console.log('App finalizado');
});