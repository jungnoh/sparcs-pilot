import dotenv from 'dotenv';
dotenv.config();
import 'logger'; // Side effect; load logger

import winston from 'winston';
import createApp from 'server';
import http from 'http';

createApp(process.env.NODE_ENV === 'development').then((app) => {
  const httpServer = http.createServer(app);
  const port = process.env.PORT ?? 8080;
  httpServer.listen(port);
  winston.info(`Listening at port ${port}`);
});
