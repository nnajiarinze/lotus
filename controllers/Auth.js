import jwt  from 'jsonwebtoken';
 
import config from '../config/config';


module.exports = function (req, res, next) {
 
    var token = req.headers['authorization'];
 
    if(!token){
      return res.status(401).send({auth: false, message: 'No token provided' });
    }
    token = token.replace('Bearer', '');
    token = token.trim();
 
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      }else{
      
      //  // res.setHeader('Access-Control-Allow-Origin', '*');
      //   res.setHeader('Access-Control-Expose-Headers','Content-Length');
      //   //res.setHeader("Access-Control-Allow-Credentials", false);
      //   res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, DELETE, OPTIONS');
      //   res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        return next();
      }
    });
  };