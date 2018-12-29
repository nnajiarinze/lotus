import express from 'express';
import parser from 'body-parser';

import router from './routes';
//import authMiddleware from './controllers/Auth';
var port = process.env.PORT || 3001;
var app = express();
app.use(parser.json());
//app.use(authMiddleware);
app.listen(port);
console.log('listening '+port);
 

app.use('/api/v1', router);
