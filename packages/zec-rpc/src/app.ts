// const path = require('path');
import path from 'path';
import express, { Router } from 'express';
import helmet from 'helmet';
import http from 'http';
// import { graphqlHTTP } from 'express-graphql';
import log from 'loglevel';
import fs from 'fs';
import fetch from 'node-fetch';
import jayson from 'jayson';
// import OAuth2Server from 'express-oauth-server';
import { isBefore, parse } from 'date-fns';
import cors from 'cors';

import rpcRoute from './routes/rpc.route';

// import routes from './routes';

type AppInterface = express.Application;

const app: AppInterface = express();

export const server = http.createServer(app);


if (process.env.NODE_ENV === 'development') {
  log.setLevel(log.levels.DEBUG);
}
else if (process.env.NODE_ENV === 'production') {
  log.setLevel(log.levels.WARN);
}

const corsOptions = process.env.NODE_ENV === 'development' ? {
  origin: ['https://elemental-pay.local', 'http://localhost:3000'],
  optionsSuccessStatus: 200,
} : {
  origin: ['https://staging.elementalpay.com', 'https://elementalpay.com'],
  optionsSuccessStatus: 200,
}

app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(cors(corsOptions))
  .use(helmet({
    // contentSecurityPolicy: {
    //   directives: {
    //     ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    //     'connect-src': ['\'self\'', 'https://elemental-sso.local'],
    //   },
    // }
  }));

const jaysonServer = new jayson.Server({
  ...rpcRoute,
  add: function(numbers, context, callback) {
    const sum = Object.keys(numbers).reduce(function(sum, key) { return sum + numbers[key]; }, 0);
    callback(null, sum);
  },

  getHeaders: function(args, context, callback) {
    callback(null, context.headers);
  },

  // old method not receiving a context object (here for reference)
  oldMethod: new jayson.Method(function(args, callback) {
    callback(null, {});
  }, {
    // this setting overrides the server option set below for this particular method only
    useContext: false
  })

}, {
  // all methods will receive a context object as the second arg
  useContext: true
});


app.use(function(req, res, next) {
  // prepare a context object passed into the JSON-RPC method
  const context = {headers: req.headers};
  jaysonServer.call(req.body, context, function(err, result) {
    if(err) return next(err);
    res.send(result || {});
  });
});

// routes(app);

const router = Router();

// const routeMiddleware = routes(router);

// app.use(routeMiddleware);

(async () => {
  // app.use('/api', cors(corsOptions), express.json(), expressMiddleware(apolloServer, {
  //   context: async ({ req }) => {
  //     return await getContextFromRequest(req);
  //   }
  // }));

  app.use((_, res) => {
    res.status(404).json({ statusCode: 404, error: 'Not Found', message: 'Page not found' });
  });

  app.use((err, req, res) => {
  // @ts-ignore
  res.locals.message = err.message;
  // @ts-ignore
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // @ts-ignore
  res.status(err.status || 500);

  // @ts-ignore
  res.end();
  });
})();

export default app;

