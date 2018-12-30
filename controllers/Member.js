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

                            } else {
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


    static createMedicals(req, res) {

        let { memberId, emergencyContactName, relationship, email, phone, additionalPhoneNumber, address, additionalDetails } = req.body;

        if (!memberId || !emergencyContactName || !relationship || !phone) {
            res.json({
                error: 'MemberId, EmergencyContactName, Relationship, and Phone are required parameters'
            });
        } else {

            var query = 'INSERT INTO members_medicals (memberId, emergencyContactName, relationship, email, phone, additionalPhoneNumber, address, additionalDetails) VALUES (' + memberId + ', "' + emergencyContactName + '", "' + relationship + '", "' + email + '", "' + phone + '", "' + additionalPhoneNumber + '","' + address + '", "' + additionalDetails + '")';
            console.log(query);
            mysql.getConnection(function (err, connection) {
                connection.query(query, function (err, result) {
                    if (err) {
                        console.log(err);
                        res.json({ 
                            response: 'An error occured '+err.sqlMessage
                        });
                    } else {
                        console.log(result);
                        res.json({
                            response: 'success',
                            id: result.insertId

                        });
                    }

                });
            });

        }
    }

    static updateMedicals(req, res) {
        let { memberId, emergencyContactName, relationship, email, phone, additionalPhoneNumber, address, additionalDetails } = req.body;

        if (!memberId || !emergencyContactName || !relationship || !phone) {
            res.json({
                error: 'MemberId, EmergencyContactName, Relationship, and Phone are required parameters'
            });
        } else {
            var query = 'UPDATE members_medicals SET emergencyContactName="'+emergencyContactName+'", relationship="'+relationship+'", email="'+email+'", phone="'+phone+'", additionalPhoneNumber="'+additionalPhoneNumber+'", address="'+address+'", additionalDetails="'+additionalDetails+'" WHERE memberId='+memberId+' ';
        
            mysql.getConnection(function (err, connection) {
                connection.query(query, function (err, result) {
                    if (err) {
                        console.log(err);
                        res.json({
                            response: 'An error occured'
                        });
                    } else {
                       
                        res.json({
                            response: 'success'

                        });
                    }

                });
            });

        }

    }


    static fetchById(req, res) {
        let id = req.query.id;

        if (id) {
            var query = 'SELECT * FROM members WHERE id=' + id;

            mysql.getConnection(function (err, connection) {
                connection.query(query, function (err, result) {
                    if (err) {

                        res.json({
                            response: 'An error occured. Failed to fetch member'
                        });
                    } else {
                        res.json({
                            response: result
                        });
                    }
                });
            });

        } else {
            res.json({
                error: 'id parameter required'
            });
        }

    }               


    static update(req, res) {

        let { id, username, firstName, lastName, dateOfBirth, gender, tagNumber, email, phone, additionalPhoneNumber, address, city } = req.body;

        admin.getUserName(req.headers['x-access-token'])
            .then(function (adminUsername) {

                var query = 'UPDATE members SET username="' + username + '" , firstName="' + firstName + '", lastName="' + lastName + '", dateOfBirth="' + dateOfBirth + '", gender="' + gender + '",tagNumber="' + tagNumber + '", email="' + email + '", phone="' + phone + '",additionalPhoneNumber="' + additionalPhoneNumber + '", address="' + address + '", city="' + city + '" WHERE id=' + id + ' ';

                mysql.getConnection(function (err, connection) {
                    connection.query(query, function (err, result) {
                        if (err) {
                            console.log(err);
                            res.json({
                                response: 'An error occured. Member creation failed'
                            });
                        } else {


                            console.log(result);
                            res.json({
                                response: 'Member successfully Updated',

                            });
                        }

                    });
                });



            });


    }


    static fetchPaginated(req, res) {
        let pageNum = req.query.pageNum;
        let pageSize = req.query.pageSize;

        if (isNaN(pageNum) || isNaN(pageSize)) {
            res.json({
                error: 'pageNum and pageSize should be numeric'
            });
        } else {


            if (pageNum < 1) {
                pageNum = 1;
            }
            if (pageSize < 1) {
                pageSize = 2;
            }
            var offset = (pageNum - 1) * pageSize;

            var query = 'SELECT * FROM members LIMIT ' + offset + ',' + pageSize;

            mysql.getConnection(function (err, connection) {
                connection.query(query, function (err, result) {
                    if (err) {
                        console.log(err);
                        res.json({
                            response: 'An error occured'
                        });
                    } else {
                        res.json({
                            response: result,

                        });
                    }

                });
            });

        }

    }

    static validateUsername(req, res) {
        let { username } = req.body;
        if (username) {
            var query = 'SELECT * FROM members WHERE username= "' + username + '"  ';

            mysql.getConnection(function (err, connection) {
                connection.query(query, function (err, result) {
                    if (err) {
                        console.log(err);
                        res.json({
                            response: 'An error occured.'
                        });
                    } else {
                        if (result.length > 0) {
                            res.json({
                                status: false
                            });
                        } else {
                            res.json({
                                status: true,
                            });
                        }


                    }

                });
            });



        } else {
            res.json({
                error: 'Username is required'
            });
        }
    }

}
