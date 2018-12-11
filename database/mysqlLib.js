import mysql from 'mysql'; 

  
var pool = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'lotus'
});



exports.getConnection = function(callback) {
    pool.getConnection(function(err, conn) {
      if(err) {
        return callback(err);
      }
      callback(err, conn);
    });
  };
