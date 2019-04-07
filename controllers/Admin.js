import mysql from '../database/mysqlLib';
import md5 from 'js-md5';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config/config';
import nodemailer from 'nodemailer';

export default class AdminController {
  static index(req, res) {
    res.json({
      response: "index"
    });
  }


  static create(req, res) {

    let { username, password } = req.body;
    if (username && password) {


      var salt = Math.random().toString(36).replace('0.', '');
      var passwordHash = md5(password + salt);
      var query = 'INSERT INTO administrator (username, passwordHash, salt) VALUES ("' + username + '", "' + passwordHash + '" , "' + salt + '")';

      var isError = false;


      mysql.getConnection(function (err, connection) {
        connection.query(query, function (err, result) {
          if (err) {
            isError = true;
          }

        });
      });


      if (isError) {
        res.json({
          response: 'An error occured'
        });
      } else {
        res.json({
          response: 'success'
        });

      }
    } else {
      res.json({
        response: 'username and password must be provided'
      });
    }
  }

  

  static getUserName(token) {
  
    token = token.replace('Bearer', '');
    token = token.trim();

    return new Promise(function (resolve, reject) {
      jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
          reject('');
        } else {

          resolve(decoded.username);
        }

      })

    });
    // return 'aaaa';

  }

  static sendNewsLetter(req,res){

    console.log(req.body.html.toString());
    
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vip4ever2020@gmail.com',
    pass: 'P@$$w0rded1'
  },
  tls: {
    rejectUnauthorized: false
}
});

var mailOptions = {
  from: 'vip4ever2020@gmail.com',
  to: 'arinzennajidaniel@gmail.com',
  subject: 'Sending Email using Node.js',
  html:  req.body.html
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
    res.json({
      response: 'Failed to send email'
    });
  } else {
    console.log('Email sent: ' + info.response);
    res.json({
      response: 'Email Sent successfully'
    });
  }
});
 
   
  }

 


  static signIn(req, res) {



    let { username, password } = req.body;
    var query = 'select * from administrator WHERE username="' + username + '"';
    var admin = {};


    mysql.getConnection(function (err, connection, ) {
      connection.query(query, function (err, result) {

        if (err) {
          res.json({
            response: 'An error occured.'
          });
        } else {
          result.forEach((admin) => {

            // create a token
            var token = jwt.sign({ id: admin.id, username: admin.username }, config.secret, {
              expiresIn: 86400 // expires in 24 hours
            });

            var passwordHash = md5(password + admin.salt);
            if (passwordHash == admin.passwordHash) {
              console.log("login succes");
              res.status(200).json({
                token: token,
                success: true,
                username: admin.username

              });
            } else {
              res.json({
                response: 'failed'
              })
            }
          });
        }

      });
    });








  }
}
