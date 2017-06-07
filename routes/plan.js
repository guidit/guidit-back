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
            if(result.affectedRows == 0){
                res.jsonp({"isSuccess":"false"});
            }else { res.jsonp({"isSuccess":"true"}) }
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
            if(daily_plan == null){
                callback(null,null);
            }else{
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
                            count++;
                            if(sightlist_in_each_plan == null){
                                if(count == daily_plan.length){callback(null,null)}
                            }else{
                                for(var k=0;k<sightlist_in_each_plan.length;k++) {
                                    insert_query2 = 'insert into daily_to_sight (daily_plan_id,sight_id) values ('+Number(daily_plan_id)+','+sightlist_in_each_plan[k].id+')';
                                    sqlconnection.query(insert_query2);
                                }
                                if(count == daily_plan.length){callback(null,null)}
                            }
                        }
                    });
                }
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
    var plan_id = req.query['id'];

    async.waterfall([
        function(callback){
            var find_query = 'select * from plan where id='+Number(plan_id);
            sqlconnection.query(find_query, function(err,result){
                if(err){
                    console.log(err);
                    res.jsonp(err);
                }else{
                    callback(null,result[0]);
                }
            });
        },function(plan,callback){
            var find_query = 'select * from daily_plan where plan_id='+Number(plan.id);
            sqlconnection.query(find_query,function(err,result){
                if(err){
                    console.log(err);
                    res.jsonp(err);
                }else{
                    callback(null,plan,result);
                }
            });
        },function(plan,daily_plan,callback){
            var count = 0;
            var sightlist = [];
            var daily_planlist = [];
            if(daily_plan.length == 0){
                respone_json = {"id":plan.id,"name":plan.name,"is_public":plan.is_public,"view_count":plan.view_count};
                callback(null,respone_json);
            }
            else{
                for(var i=0;i<daily_plan.length;i++){
                    var find_query = 'select * from daily_to_sight where daily_plan_id='+Number(daily_plan[i].id);
                    sqlconnection.query(find_query,function(err,result){
                        if(err){
                            console.log(err);
                            res.jsonp(err);
                        }else{
                            if(result.length==0){
                                daily_planlist.push({"id":daily_plan[count].id,"day_num":daily_plan[count].day_num,"review":daily_plan[count].review,"picture":daily_plan[count].picture})
                                count++;
                                sightlist = [];
                                if(count == daily_plan.length){
                                    respone_json = {"id":plan.id,"name":plan.name,"is_public":plan.is_public,"view_count":plan.view_count,"daily_plan":daily_planlist};
                                    callback(null,respone_json);
                                }
                            }else{
                                for(var count2=0;count2<result.length;count2++){
                                    sightlist.push({"id":result[count2].sight_id});
                                    if(count2 == result.length-1){
                                        daily_planlist.push({"id":daily_plan[count].id,"day_num":daily_plan[count].day_num,"review":daily_plan[count].review,"picture":daily_plan[count].picture,"sight_list":sightlist})
                                        count++;
                                        sightlist = [];
                                        if(count == daily_plan.length){
                                            respone_json = {"id":plan.id,"name":plan.name,"is_public":plan.is_public,"view_count":plan.view_count,"daily_plan":daily_planlist};
                                            callback(null,respone_json);
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            }
        }
    ],function(err,result){
        if(err){ console.log(err); }
        else {
            res.jsonp(result);
        }
    }
    )
    

});

router.get('/list',function(req,res){

    // to do;
});

router.post('/review',function(req,res){

    // to do;
});


module.exports = router;
