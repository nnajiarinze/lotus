import express from 'express';
import router from './routes';

// import mysql from './database/mysqlLib'; 

// mysql.getConnection(function (err, connection) {
//      connection.query("SELECT * FROM administrator WHERE username='arinze.nnaji'", function (err, result) {
//         if (err) throw err;
       
//         console.log(result);
//     });
//     });



var app = express();

app.listen(3000);
console.log('listening');

app.use('/api/v1', router);
