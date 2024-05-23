import http from 'http';
import {Server} from 'socket.io';

const server = http.createServer();

const io = new Server(server)


io.on('connection', client => {
  client.on('event', data => { 
    const type = data.type;

    // 3 admin events

    // 2 client events
    
    // UserManager => QuizManager => Quiz => broadcast

  });
  client.on('disconnect', () => { });
});

server.listen(3000);