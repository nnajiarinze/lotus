import mysql from '../database/mysqlLib';
import moment from 'moment';
import admin from './Admin';


import config from '../config/config';
import { start } from 'repl';

export default class MemberController {

    static create(req, res) {

        let { username, firstName, lastName, dateOfBirth, gender, tagNumber, email, phone, additionalPhoneNumber, address, city, image } = req.body;

        if (!username || !firstName || !lastName || !dateOfBirth || !gender || !email || !phone || !city || !Date.parse(dateOfBirth)) {
            res.json({
                response: 'Incomplete parameters'
            });
        } else {
            var dateCreated = new Date().toLocaleString();
            admin.getUserName(req.headers['authorization'])
                .then(function (adminUsername) {

                    var query = 'INSERT INTO members (username, firstName, lastName, dateOfBirth, gender, tagNumber, email, phone, additionalPhoneNumber,address,city,dateCreated,createdBy,image)' +
                        ' VALUES ("' + username + '","' + firstName + '","' + lastName + '","' + dateOfBirth + '","' + gender + '","' + tagNumber + '","' + email + '","' + phone + '","' + additionalPhoneNumber + '","' + address + '","' + city + '","' + dateCreated + '","' + adminUsername + '","' + image + '") ';

                    mysql.getConnection(function (err, connection) {
                        connection.query(query, function (err, result) {
                            if (err) {
                                res.json({
                                    response: 'An error occured. Member creation failed'
                                });

                            } else {

                                query = 'SELECT * FROM members WHERE id=' + result.insertId;

                                mysql.getConnection(function (err, connection) {
                                    connection.query(query, function (err, result) {
                                        if (err) {

                                            res.json({
                                                response: 'An error occured ' + err.sqlMessage
                                            });
                                        } else {
                                            res.json({
                                                response: 'Member successfully created',
                                                data: result
                                            });
                                        }
                                    });
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

            mysql.getConnection(function (err, connection) {
                connection.query(query, function (err, result) {
                    if (err) {

                        res.json({
                            response: 'An error occured ' + err.sqlMessage
                        });
                    } else {

                        query = 'SELECT * FROM members_medicals WHERE id=' + result.insertId;

                        mysql.getConnection(function (err, connection) {
                            connection.query(query, function (err, result) {
                                if (err) {

                                    res.json({
                                        response: 'An error occured ' + err.sqlMessage
                                    });
                                } else {
                                    res.json({
                                        response: 'Medicals created successfully',
                                        data: result
                                    });
                                }
                            });
                        });
                    }

                });
            });

        }
    }

    static createSubscription(req, res) {

        let { memberId, subscriptionId, months, amount, startDate } = req.body;

        if (!memberId || !subscriptionId || !months || !amount || !startDate) {
            res.json({
                response: 'Incomplete parameters'
            });
        } else {
            var dateFormat = 'YYYY-MM-DD';
            startDate = moment(startDate, dateFormat, true);
            
            if (startDate.isValid()) {

                var endDate = moment(startDate).add(months, 'month').format(dateFormat);
                startDate = moment(startDate).format(dateFormat);

                var query = 'INSERT INTO member_subscriptions (memberId, subscriptionId, months, amount, startDate, endDate) VALUES (' + memberId + ', ' + subscriptionId + ', ' + months + ', "' + amount + '", "' + startDate + '", "' + endDate + '") ';


                mysql.getConnection(function (err, connection) {
                    connection.query(query, function (err, result) {
                        if (err) {
                            console.log(err);
                            res.json({
                                response: 'An error occured ' + err.sqlMessage
                            });
                        } else {
                          
                            MemberController.updateMemberEndDate(memberId ,endDate);

                            query = 'SELECT * FROM member_subscriptions WHERE id=' + result.insertId;
                            console.log(query); 

                            mysql.getConnection(function (err, connection) {
                                connection.query(query, function (err, result) {
                                    if (err) {
                                        console.log(err);
                                        res.json({
                                            response: 'An error occured ' + err.sqlMessage
                                        });
                                    } else {
                                        res.json({
                                            response: 'Member subscription successfully created',
                                            data: result
                                        });
                                    }
                                });
                            });


                        }

                    });
                });

            } else {
                res.json({
                    response: 'Invalid start date'
                })
            }

        }

    }
    
    static updateMemberEndDate(memberId, endDate) {
       var query = 'UPDATE members SET subEndDate="'+endDate+'" WHERE id= '+memberId+'   ';
        mysql.getConnection(function (err, connection) {
            connection.query(query, function (err, result) {
                if (err) {
                    console.log(err);
                }
            });
        });
    }

    static membersStats(req, res) {
        var dateFormat = 'YYYY-MM-DD';
        var today = moment().format(dateFormat);
        var totalMembersQuery = 'SELECT COUNT(*) as totalMembers FROM members';
        var activeMembersQuery = 'SELECT COUNT(*) as activeMembers'
        + ' FROM members'
        + ' WHERE  subEndDate >= "' + today + '" ';
        var activeMembers = 0;
        var totalMembers = 0;

        mysql.getConnection(function (err, connection) {
            connection.query(activeMembersQuery, function (err, result) {
                if (err) {
                    res.json({
                        response: 'An error occured ' + err.sqlMessage
                    });
                } else {
                    console.log(result)
                    activeMembers = result[0].activeMembers;

                    mysql.getConnection(function (err, connection) {
                        connection.query(totalMembersQuery, function (err, result) {
                            if (err) {
                                res.json({
                                    response: 'An error occured ' + err.sqlMessage
                                });
                            } else {
                                totalMembers = result[0].totalMembers;
                                console.log('total ', totalMembers);
                                console.log('active ', activeMembers);
                                res.json({
                                    response: 'success',
                                    active: activeMembers,
                                    inactive: totalMembers - activeMembers,
                                    totalMembers: totalMembers
                                });
                            }

                        });
                    });
                }

            });
        });
    }

    static fetchPagniatedActiveMembers(req, res) {

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

            var dateFormat = 'YYYY-MM-DD';
            var today = moment().format(dateFormat);

            var query = 'SELECT *'
                + ' FROM members'
                + ' WHERE  subEndDate >= "' + today + '"  LIMIT ' + offset + ',' + pageSize;

            mysql.getConnection(function (err, connection) {
                connection.query(query, function (err, result) {
                    if (err) {
                        res.json({
                            response: 'An error occured ' + err.sqlMessage
                        });
                    } else {
                        res.json({
                            response: 'success',
                            data: result
                        });
                    }

                });
            });
        }
    }

    static fetchPaginatedInactiveMembers(req, res) {

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

            var dateFormat = 'YYYY-MM-DD';
            var today = moment().format(dateFormat);

            var query = 'select * from members WHERE subEndDate IS NULL OR subEndDate < "'+today+'"  LIMIT ' + offset + ',' + pageSize;
            console.log(query);
            mysql.getConnection(function (err, connection) {
                connection.query(query, function (err, result) {
                    if (err) {
                        res.json({
                            response: 'An error occured ' + err.sqlMessage
                        });
                    } else {
                        res.json({
                            response: 'success',
                            data: result
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
            var query = 'UPDATE members_medicals SET emergencyContactName="' + emergencyContactName + '", relationship="' + relationship + '", email="' + email + '", phone="' + phone + '", additionalPhoneNumber="' + additionalPhoneNumber + '", address="' + address + '", additionalDetails="' + additionalDetails + '" WHERE memberId=' + memberId + ' ';

            mysql.getConnection(function (err, connection) {
                connection.query(query, function (err, result) {
                    if (err) {

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
                            response: 'An error occured ' + err.sqlMessage
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

        admin.getUserName(req.headers['authorization'])
            .then(function (adminUsername) {

                var query = 'UPDATE members SET username="' + username + '" , firstName="' + firstName + '", lastName="' + lastName + '", dateOfBirth="' + dateOfBirth + '", gender="' + gender + '",tagNumber="' + tagNumber + '", email="' + email + '", phone="' + phone + '",additionalPhoneNumber="' + additionalPhoneNumber + '", address="' + address + '", city="' + city + '" WHERE id=' + id + ' ';

                mysql.getConnection(function (err, connection) {
                    connection.query(query, function (err, result) {
                        if (err) {

                            res.json({
                                response: 'An error occured ' + err.sqlMessage
                            });
                        } else {



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
        let status = req.query.status;
        if(status){
            if(status != 'active' && status != 'inactive'){
               
            return   res.json({
                    response: 'An error occured  status is invalid'
                });
            }
        }

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
            
            if(!status){
                var query = 'SELECT * FROM members LIMIT ' + offset + ',' + pageSize;
            }else{
                var dateFormat = 'YYYY-MM-DD';
                var today = moment().format(dateFormat);

                if(status=='active'){
                    var query = 'SELECT *'
                    + ' FROM members'
                    + ' WHERE  subEndDate >= "' + today + '"  LIMIT ' + offset + ',' + pageSize;
                }else{
                        //inactive
                      var query = 'select * from members WHERE subEndDate IS NULL OR subEndDate < "'+today+'"  LIMIT ' + offset + ',' + pageSize;
                }
            }

          

            mysql.getConnection(function (err, connection) {
                connection.query(query, function (err, result) {
                    if (err) {


                        res.json({
                            response: 'An error occured ' + err.sqlMessage
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

    static deleteSubscription(req,res){
        
    }

}