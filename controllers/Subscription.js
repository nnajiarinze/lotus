import mysql from '../database/mysqlLib';


export default class SubscriptionController {

    static create(req, res) {

        let { name, price } = req.body;

        if (!name || !price) {
            res.json({
                response: 'Incomplete parameters'
            });
        } else {

            var query = 'INSERT INTO subscription (name, price) VALUES ("' + name + '", "' + price + '")';

            mysql.getConnection(function (err, connection) {
                connection.query(query, function (err, result) {
                    if (err) {
                        res.json({
                            response: 'An error occured ' + err.sqlMessage
                        });

                    } else {
                        res.json({
                            response: 'Subscription created successfully',
                            id: result.insertId
                        });
                    }
                });
            });
        }
    }

    
    static update(req, res) {

        let { id, name, price } = req.body;

        if (!id || !name || !price) {
            res.json({
                response: 'Incomplete parameters'
            });
        } else {

            var query = 'UPDATE subscription SET name="'+name+'", price="'+price+'" WHERE id= '+id+' ';

            mysql.getConnection(function (err, connection) {
                connection.query(query, function (err, result) {
                    if (err) {
                        res.json({
                            response: 'An error occured ' + err.sqlMessage
                        });

                    } else {
                        res.json({
                            response: 'Subscription updated successfully'
                        });
                    }
                });
            });
            
        }
    }


}
