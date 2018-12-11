import mysql from '../database/mysqlLib'; 

export default class AdminController {
    static index(req, res) {

      mysql.getConnection(function (err, connection) {
        connection.query("SELECT * FROM administrator WHERE username='arinze.nnaji'", function (err, result) {
           if (err) throw err;
          
           console.log(result);
       });
       });
        
      res.json({
        status: 'success',
        data: {
          'ddda': 'ddas'
        },
      });
    }
}
