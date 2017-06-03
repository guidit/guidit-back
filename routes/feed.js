var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var mysql_connection = require('./mysql.js');

var sqlconnection = mysql.createConnection( mysql_connection.forconnection() );


router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/create',function(req,res){

    var id = Number(req.body.id);
    var content = req.body.content;
    var city = Number(req.body.city);
    var milliseconds = new Date().getTime();
    console.log(req.body);
    console.log(req.body.id+" "+req.body.content+" "+req.body.city);
    if(city<0 || city>8){
        res.jsonp({"isSuccess":"false"});
    }
    else{
        var insert_query = 'insert into feed (content,city,date,user_id) values ("'+content+'","'+city+'","'+milliseconds+'","'+id+'")';

        sqlconnection.query(insert_query, function(err,result){
            if(err){
                console.log(err);
                res.jsonp(err);
            }
            else{
                res.jsonp({"isSuccess":"true"});
            }
        });
    }
});

router.get('/delete',function(req,res){
    
    var id = req.query['id'];

    var delete_query = 'delete from feed where id="'+id+'"';

    sqlconnection.query(delete_query, function(err,result){
        if(err){
            console.log(err);
            res.jsonp(err);
        }
        else{
            if(result.affectedRows == 0){
                res.jsonp({"isSuccess":"false"});
            }else{
                res.jsonp({"isSuccess":"true"});
            }
        }
    });    
});
/*
router.get('/list',function(req,res){

    var city = req.query['city'];

    if(city<1 || city>8){
        res.jsonp({"issuccess":"false"});
    }
    else{
        var find_query = 'select from 
    }
});
*/

module.exports = router;

