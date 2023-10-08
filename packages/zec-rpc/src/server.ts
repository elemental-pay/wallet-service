import http from 'http';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();


import app, { server } from './app';

const port = process.env.PORT || 3000;

// export let redisOmClient: Client;


const onListening = async () => {
  const address = server.address();
  const bind = (typeof address === 'string') ? `pipe ${address}` : `port ${address.port}`;

  console.log(`Listening on: ${bind}`);
};


server.listen(port);

server.on('listening', onListening);

const serverCloseAsync = () => new Promise((resolve, reject) => {
  try {
    server.close(() => {
      resolve(null);
    });
  } catch (e) {
    reject(e);
  }
});


const onServerStop = async () => {
  try {
    await serverCloseAsync();

    console.log('Server stopped.');
    process.exit();
  } catch (err) {
    console.log('Failed to stop server');
  }
};

process.on('exit', onServerStop);

process.on('SIGINT', onServerStop);

process.on('SIGUSR1', onServerStop);
process.on('SIGUSR2', onServerStop);

