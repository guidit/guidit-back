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

/* detail sight information */
router.get('/detail',function(req,res){
    var user_id = req.query['userId'];
    var sight_id = req.query['sightId'];
    var favorite = false;
    var find_query = 'select id,name,picture,score,information from sight where id='+sight_id;
    var favorite_check_query = 'select id from favorite where sight_id='+sight_id+' and user_id='+user_id;

    sqlconnection.query(favorite_check_query, function(err,result){
        if(err){
            console.log(err);
            res.jsonp(err);
        }
        else{
            if(result.length==0){ favorite = false; }
            else{ favorite = true; }

            sqlconnection.query(find_query, function(err,result1){
                if(err){
                    console.log(err);
                    res.jsonp(err);
                }
                else{
                    if(result1.length == 0){
                        res.jsonp([{'id':-1}]);
                    }
                    else{
                        var sight_information = result1[0];
                        sight_information['favorite'] = favorite;
                        res.jsonp([sight_information]); 
                    }
                }
            });
        }
    });
});

router.get('/favorite',function(req,res){
    var user_id = req.query['userId'];
    var sight_id = req.query['sightId'];
    var favorite = req.query['favorite'];

    var milliseconds = new Date().getTime();

    if(favorite=="true"){
        var find_query = 'select * from favorite where sight_id='+sight_id+' and user_id='+user_id;
        var insert_query = 'insert into favorite (date,sight_id,user_id) values ('+milliseconds+','+sight_id+','+user_id+')';
        
        sqlconnection.query(find_query, function(err,result){
            if(err){
                console.log(err);
                res.jsonp(err);
            }else{
                if(result.length==0){
                    sqlconnection.query(insert_query, function(err,result){
                        if(err){
                            console.log(err);
                            res.jsonp(err);
                        }else{
                            res.jsonp({"isSuccess":"true"});
                        }
                    })
                }else{
                    res.jsonp({"isSuccess":"false"});
                }
            }
        });
    }
    else{
        var delete_query = 'delete from favorite where user_id='+user_id+' and sight_id='+sight_id;

        sqlconnection.query(delete_query, function(err,result){
            if(err){
                console.log(err);
                res.jsonp(err);
            }else{
                if( result.affectedRows == 0 ){ res.jsonp({"isSuccess":"false"});}
                else { res.jsonp({"isSuccess":"true"}); }
            }
        });
    }
});


module.exports = router;
