import express from 'express';
import parser from 'body-parser';
import cors from 'cors';
import router from './routes';
//import authMiddleware from './controllers/Auth';
var port = process.env.PORT || 3000;
var app = express();
app.use(parser.json());
//app.use(authMiddleware);
app.listen(port);
console.log('listening '+port);
 

app.use('/api/v1', router);
