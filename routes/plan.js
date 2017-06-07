var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var mysql_connection = require('./mysql.js');
var async = require('async');

var sqlconnection = mysql.createConnection( mysql_connection.forconnection() );

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/delete',function(req,res){

    var plan_id = req.query['id'];
    var delete_query = 'delete from plan where id='+Number(plan_id);

    sqlconnection.query(delete_query, function(err,result){
        if(err){
            console.log(err);
            res.jsonp(err);
        }
        else{
        }
    });


});


router.post('/create',function(req,res){
    var name = req.body.name;
    var user_id = Number(req.body.id);
    var is_public = req.body.is_public;
    var daily_plan = req.body.daily_plan;
    var insert_query = '';
    var insert_query2 = '';

    async.waterfall([
        function(callback){
            insert_query = 'insert into plan (name,is_public,user_id) values("'+name+'","'+is_public+'",'+user_id+')';
            sqlconnection.query(insert_query, function(err,result){
                if(err){
                    console.log(err);
                    res.jsonp(err);
                }
                else{
                    var plan_id = result.insertId;
                    callback(null,Number(plan_id));
                }
            });
        },function(plan_id,callback){
            var count =0;
            console.log(daily_plan);
            console.log(daily_plan[0].sight_list);
            for(var i=0;i<daily_plan.length;i++){
                insert_query = 'insert into daily_plan (day_num,plan_id) values ('+Number(daily_plan[i].day_num)+','+plan_id+')';
                sqlconnection.query(insert_query, function(err,result){
                    if(err){
                        console.log(err);
                        res.jsonp(err);
                    }
                    else{
                        var daily_plan_id = result.insertId;
                        var sightlist_in_each_plan = daily_plan[count].sight_list;
                        for(var k=0;k<sightlist_in_each_plan.length;k++) {
                            insert_query2 = 'insert into daily_to_sight (daily_plan_id,sight_id) values ('+Number(daily_plan_id)+','+sightlist_in_each_plan[k].id+')';
                            sqlconnection.query(insert_query2);
                        }
                        count++;
                        if(count == daily_plan.length){callback(null,null)}
                    }
                });
            }
        }
    ],function(err,result){
        if(err){ console.lor(err);}
        else {
            res.jsonp({"isSuccess":"true"});
        }
    }
    )
    
});

router.post('/modify',function(req,res){

    // to do;
});

router.get('/detail',function(req,res){

    // to do;
});

router.get('/list',function(req,res){

    // to do;
});

router.post('/review',function(req,res){

    // to do;
});


module.exports = router;
