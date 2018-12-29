import jwt  from 'jsonwebtoken';
 
import config from '../config/config';


module.exports = function (req, res, next) {

    var token = req.headers['x-access-token'];
        
    if(!token){
      return res.status(401).send({auth: false, message: 'No token provided' });
    }

    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      }else{
        return next();
      }
    });
  };