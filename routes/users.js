var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var mysql_connection = require('./mysql.js');
//mysql conf

//console.log(mysql_connection.forconnection());
var sqlconnection = mysql.createConnection( mysql_connection.forconnection() );



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



/* Login */
router.get('/login',function(req,res){
    var user_id = req.query['id'];
    var password = req.query['password'];
    var find_query = 'select id,user_id,name,profile from user where id='+mysql.escape(user_id)+' and password='+mysql.escape(password);    

    sqlconnection.query(find_query, function(err,result){
        if(err){ 
            console.log(err); 
            res.jsonp(err);
        }
        else{
            if(result.length == 0) {
                res.jsonp({'id':-1});
            }
            else {
                res.jsonp(result);
            }
        }
    });
});

/* Sign up */
router.get('/signup',function(req,res){
    var name = req.query['name'];
    var user_id = req.query['id'];
    var password = req.query['password'];

    var insert_query = 'insert into user (user_id,password,name,profile) values ("'+user_id+'","'+password+'","'+name+'","testprofile")';
    sqlconnection.query(insert_query, function(err,result){
        if(err){ 
            console.log(err);
            res.jsonp(err);
        }
        else{
            console.log(result);
            res.jsonp({'isSuccess':'true'});
        }
    });
});



module.exports = router;
