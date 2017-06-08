var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var mysql_connection = require('./mysql.js');
var async = require('async');
var sqlconnection = mysql.createConnection( mysql_connection.forconnection() );


var jsonFile = require('jsonfile');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Guidit' });
});



router.get('/main',function(req,res){

    async.waterfall([
        function(callback){
            var return_info
            var find_query = 'select * from plan order by id limit 1';
            sqlconnection.query(find_query,function(err,result){
                if(err){
                    console.log(err);
                    res.jsonp(err);
                }else{
                    callback(null,result);
                }
            });
        },function(plan,callback){
            var find_query = 'select * from sight where id=56136';
            sqlconnection.query(find_query,function(err,result){
                if(err){
                    console.log(err);
                    res.jsonp(err);
                }else{
                    var return_info = [];
                    return_info.push(plan[0]);
                    return_info.push(result[0]);
                    callback(null,return_info);
                }
            });
        }
    ],function(err,result){
        if(err){
            console.log(err);
        }else{
            res.jsonp(result);
        }
    }
    );
    

});




module.exports = router;
