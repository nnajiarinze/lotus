import jwt  from 'jsonwebtoken';
 
import config from '../config/config';


module.exports = function (req, res, next) {
 console.log(req);
    var token = req.headers['x-access-token'];
        
    if(!token){
      return res.status(401).send({auth: false, message: 'No token provided' });
    }

    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      }else{


        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Expose-Headers','Content-Length');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        );
        return next();
      }
    });
  };