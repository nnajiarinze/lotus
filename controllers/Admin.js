import mysql from '../database/mysqlLib'; 
import md5 from 'js-md5';

import jwt  from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config/config';

export default class AdminController {
    static index(req, res) {
        res.json({response: "index"
      });
    }


    static create(req, res) {

      let {username,password } = req.body;
      if(username && password){

    
      var salt = Math.random().toString(36).replace('0.', '');
      var passwordHash = md5(password+salt);
      var query = 'INSERT INTO administrator (username, passwordHash, salt) VALUES ("'+username+'", "'+ passwordHash +'" , "'+ salt+'")';
      console.log(query);
      var isError = false;

    
        mysql.getConnection(function (err, connection) {
          connection.query(query, function (err, result) {
             if (err){ 
                isError= true;
              } 
             console.log(result);
         });
       });

     
       if(isError){
        res.json({
          response: 'An error occured'
        });
       }else{
        res.json({
          response: 'success'
        });

      }
    }else{
      res.json({
        response: 'username and password must be provided'
      });
    } 
  }

  static getUserNames(url) {
    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.timeout = 2000;
      xhr.onreadystatechange = function(e) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr.response)
          } else {
            reject(xhr.status)
          }
        }
      }
      xhr.ontimeout = function () {
        reject('timeout')
      }
      xhr.open('get', url, true)
      xhr.send();
    })
  }

  static getUserName(token){
   
   return new Promise(function (resolve, reject) {
     jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {      
       reject('');
      }else{
        resolve('arinze.nnaji');
      }

    })
    
    });
     // return 'aaaa';
     
  }
  static options(req, res){
      
    console.log('got here');
    if (req.method === 'OPTIONS') {
     console.log('!OPTIONS');
     var headers = {};
     // IE8 does not allow domains to be specified, just the *
     // headers["Access-Control-Allow-Origin"] = req.headers.origin;
     headers["Access-Control-Allow-Origin"] = "*";
     headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
     headers["Access-Control-Allow-Credentials"] = false;
     headers["Access-Control-Max-Age"] = '86400'; // 24 hours
     headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
     res.writeHead(200, headers);
     res.end();
 }


  }

  
    static signIn(req, res){
      
      

      let {username,password } = req.body;
      var query = 'select * from administrator WHERE username="'+username+'"';
      var admin={};

           
    mysql.getConnection(function (err, connection,) {
        connection.query(query, function (err, result) {
          result.forEach( (admin) => {

            // create a token
          var token = jwt.sign({ id: admin.id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
          });
          
            var passwordHash = md5(password+admin.salt);
             if(passwordHash == admin.passwordHash){
               console.log("login succes");
               res.status(200).json({token: token,
                success: true,
                username: admin.username

                      });
            }else{
              res.json({
                response:'failed'
              })
            }         
        });
       });
    });


    
   
    
   
    
     
    }
}
