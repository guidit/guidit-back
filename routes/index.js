/******************************************************/
/*              2017 First semester                   */
/*      Database Final Project 'Guidit' Back-End      */
/*    Made By Sohwan Park (github.com/bleetoteelb)    */
/*         Last modification  2017.06.12              */
/******************************************************/
/*                   Index Routers                    */
/******************************************************/

var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var mysql_connection = require('./mysql.js');
var async = require('async');
var sqlconnection = mysql.createConnection( mysql_connection.forconnection() );

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Guidit' });
});

/* Return information for main */
/* Most popular travel plan & sight */
router.get('/main',function(req,res){

    async.waterfall([
        function(callback){
            var return_info
            var find_query = 'select * from plan where id=34';
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
