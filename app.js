import express from 'express';
import parser from 'body-parser';

import router from './routes';
//import authMiddleware from './controllers/Auth';
var port = process.env.PORT || 3000;
var app = express();
app.use(parser.json());
app.use(cors({
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  }));

  app.use(cors({
    credentials: true,
  }));
//app.use(authMiddleware);
app.listen(port);
console.log('listening '+port);
 

app.use('/api/v1', router);
