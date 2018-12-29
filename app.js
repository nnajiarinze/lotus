import express from 'express';
import parser from 'body-parser';
import router from './routes';
//import authMiddleware from './controllers/Auth';

var app = express();
app.use(parser.json());
//app.use(authMiddleware);
app.listen(process.env.PORT || 3000);
console.log('listening');

app.use('/api/v1', router);
