import mysql from 'mysql'; 

  
// var pool = mysql.createPool({
//     host     : 'localhost',
//     user     : 'root',
//     password : 'password',
//     database : 'lotus'
// });

var pool = mysql.createPool({
  host     : 'us-cdbr-iron-east-01.cleardb.net',
  user     : 'b37e36e1d6a9a4',
  password : '4a351487',
  database : 'heroku_d17fb34a6b1ec3e'
});



exports.getConnection = function(callback) {
    pool.getConnection(function(err, conn) {
      if(err) {
        console.log(err);
        return callback(err);
      }
      callback(err, conn);
    });
  };
