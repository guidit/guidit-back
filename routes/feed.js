var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var mysql_connection = require('./mysql.js');

var sqlconnection = mysql.createConnection( mysql_connection.forconnection() );


router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/create',function(req,res){

    var id = req.query['id'];
    var content = req.query['content'];
    var city = req.query['city'];
    var milliseconds = new Date().getTime();

    if(city<1 || city>8){
        res.jsonp({"issuccess":"false"});
    }
    else{
        var insert_query = 'insert into feed (content,city,date,user_id) values ("'+content+'","'+city+'","'+milliseconds+'","'+id+'")';

        sqlconnection.query(insert_query, function(err,result){
            if(err){
                console.log(err);
                res.jsonp(err);
            }
            else{
                res.jsonp({"issuccess":"true"});
            }
        });
    }
});

/*
router.get('/list',function(req,res){

    var city = req.query['city'];

    if(city<1 || city>8){
        res.jsonp({"issuccess":"false"});
    }
    else{
        var find_query = "select 
    }
});
*/

module.exports = router;

