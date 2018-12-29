import mysql from '../database/mysqlLib';

import admin from './Admin';


import config from '../config/config';

export default class MemberController {

    static create(req, res) {

        let { username, firstName, lastName, dateOfBirth, gender, tagNumber, email, phone, additionalPhoneNumber, address, city } = req.body;

        if (!username || !firstName || !lastName || !dateOfBirth || !gender || !email || !phone || !city || !Date.parse(dateOfBirth)) {
            res.json({
                response: 'Incomplete parameters'
            });
        } else {
            var dateCreated = new Date().toLocaleString();
            admin.getUserName(req.headers['x-access-token'])
                .then(function (adminUsername) {

                    var query = 'INSERT INTO members (username, firstName, lastName, dateOfBirth, gender, tagNumber, email, phone, additionalPhoneNumber,address,city,dateCreated,createdBy)' +
                        ' VALUES ("' + username + '","' + firstName + '","' + lastName + '","' + dateOfBirth + '","' + gender + '","' + tagNumber + '","' + email + '","' + phone + '","' + additionalPhoneNumber + '","' + address + '","' + city + '","' + dateCreated + '","' + adminUsername + '") ';

                    mysql.getConnection(function (err, connection) {
                        connection.query(query, function (err, result) {
                            if (err) {
                                res.json({
                                    response: 'An error occured. Member creation failed'
                                });
                               
                            }else{
                                res.json({
                                    response: 'Member successfully created',
                                    id: result.insertId
                                });
                            }
                            

                           

                        });
                    });

                   
                });


        }



    }

    static fetchById(req, res){
        let  id  = req.query.id;

        if(id){
            var query = 'SELECT * FROM members WHERE id='+id;
            
            mysql.getConnection(function (err, connection) {
                connection.query(query, function (err, result) {
                    if (err) {
                       
                        res.json({
                            response: 'An error occured. Failed to fetch member'
                        });
                    }else{
                        res.json({
                            response: result
                        });
                    }
                });
            });
            
        }else{
            res.json({
                error: 'id parameter required'
            });
        }

    }


    static update(req, res) {

        let { id, username, firstName, lastName, dateOfBirth, gender, tagNumber, email, phone, additionalPhoneNumber, address, city } = req.body;

        admin.getUserName(req.headers['x-access-token'])
        .then(function (adminUsername) {
         
            var query = 'UPDATE members SET username="'+username+'" , firstName="'+firstName+'", lastName="'+lastName+'", dateOfBirth="'+dateOfBirth+'", gender="'+gender+'",tagNumber="'+tagNumber+'", email="'+email+'", phone="'+phone+'",additionalPhoneNumber="'+additionalPhoneNumber+'", address="'+address+'", city="'+city+'" WHERE id='+id+' ';
          
            mysql.getConnection(function (err, connection) {
                connection.query(query, function (err, result) {
                    if (err) {
                        console.log(err);
                        res.json({
                            response: 'An error occured. Member creation failed'
                        });
                    }else{
                        

                    console.log(result);
                    res.json({
                        response: 'Member successfully Updated',
                       
                    });
                }

                });
            });
          
          
           
        });

       
    }



    static fetchPaginated(req, res){
        let  pageNum  = req.query.pageNum;
        let  pageSize = req.query.pageSize;

    }

}
