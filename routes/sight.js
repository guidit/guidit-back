var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var mysql_connection = require('./mysql.js');
var fs = require('fs');
var jsonFile = require('jsonfile');

var sqlconnection = mysql.createConnection( mysql_connection.forconnection() );


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});


/* return sight*/
router.get('/sight',function(req,res){
    var locationX = Number(req.query['X']);
    var locationY = Number(req.query['Y']);
    
    var xmin = locationX-0.025;
    var xmax = locationX+0.025;
    var ymin = locationY-0.025;
    var ymax = locationY+0.025;

    var find_query = 'select id,name,type,picture,score,locationX,locationY from sight '
    find_query += 'where locationX between '+xmin+' and '+xmax+' and locationY between '+ymin+' and '+ymax;

    console.log(find_query);
    sqlconnection.query(find_query, function(err,result){
        if(err){
            console.log(err);
            res.jsonp(err);
        }
        else{
            if(result.length == 0) {
                res.jsonp([{'id':-1}]);
            }
            else {
                res.jsonp(result);
            }
        }
    });
});

router.get('/test',function(req,res){

    sqlconnection.query('select picture from sight where locationX=127.0054853',function(err,result){
        if(err){
            console.log(err);
            res.jsonp(err);
        }
        else{
            if(result.length == 0) {
                res.jsonp([{'id':-1}]);
            }
            else {
                console.log(result);
                res.jsonp(result);
            }
        }    
    });
});


module.exports = router;
