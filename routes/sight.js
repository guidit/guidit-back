var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var mysql_connection = require('./mysql.js');
var fs = require('fs');
var jsonFile = require('jsonfile');
var async = require('async');

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
    var find_query = 'select id,name,picture,score,information from sight where id='+sight_id;
    var favorite_check_query = 'select id from favorite where sight_id='+sight_id+' and user_id='+user_id;
    var score_find_query = 'select score from sight_score where sight_id='+sight_id+' and user_id='+user_id;

    async.waterfall([
        function(callback){
            sqlconnection.query(favorite_check_query, function(err,result){
                if(err){
                    console.log(err);
                    res.jsonp(err);
                }
                else{
                    var favorite = false;
                    if(result.length==0){ callback(null,false); }
                    else{ callback(null,true); }
                }
            });
        },function(favorite,callback){
            sqlconnection.query(score_find_query, function(err,result){
                if(err){
                    console.log(err);
                    res.jsonp(err);
                }
                else{
                    if(result.length == 0) { callback(null,favorite,-1) }
                    else{ callback(null,favorite,result[0].score); }
                }
            });
        },function(favorite,score,callback){
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
                        sight_information['myScore'] = score;
                        callback(null,[sight_information]);
                    }
                }
            });
        }
    ], function(err,sight_information){
        if(err){console.log(err)}
        else {
            res.jsonp(sight_information);
        }
    });



/*
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
*/
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

router.post('/foodtruckcreate',function(req,res){
    var user_id = req.body.user_id;
    var name = req.body.name;
    var location_ = req.body.location;
    var information = req.body.description;
    var picture = req.body.file;

    var insert_query = 'insert into foodtruck (user_id,name,picture,information,location) values('+Number(user_id)+',"'+name+'","'+picture+'","'+information+'","'+location_+'")';

    sqlconnection.query(insert_query, function(err,result){
        if(err){
            console.log(err);
            res.jsonp(err);
        }else{
            res.jsonp({"isSuccess":"true"});
        }
    });
});

router.post('/foodtrucksetting',function(req,res){
    var truck_id = req.body.id;
    var name = req.body.name;
    var location_ = req.body.location;
    var information = req.body.description;
    var picture = req.body.file;

    if(picture == null){
        var update_query = 'update foodtruck set name="'+name+'", information="'+information+'", location="'+location_+'" where id='+Number(truck_id);
    }else{
        var update_query = 'update foodtruck set name="'+name+'", picture="'+picture+'", information="'+information+'", location="'+location_+'" where id='+Number(truck_id);
    }
    sqlconnection.query(update_query, function(err,result){
        if(err){
            console.log(err);
            res.jsonp(err);
        }else{
            if(result.affectedRows == 0) {
                res.jsonp({"isSuccess":"false"});
            }else{
                res.jsonp({"isSuccess":"true"});
            }
        }
    });
});

router.get('/foodtruck',function(req,res){
    var user_id = req.query['id'];

    var find_query = 'select * from foodtruck where user_id='+Number(user_id);
    
    sqlconnection.query(find_query, function(err,result){
        if(err){
            console.log(err);
            res.jsonp(err);
        }else{
            if(result.length == 0) {
                res.jsonp({"id":-1});
            }else{
                res.jsonp(result[0]);
            }
        }
    });
});

router.get('/score',function(req,res){

    var user_id = Number(req.query['userId']);
    var sight_id = Number(req.query['sightId']);
    var score = Number(req.query['myScore']);

    async.waterfall([
        function(callback){
            var find_query = 'update sight_score set score='+score+' where sight_id='+sight_id+' and user_id='+user_id;
            sqlconnection.query(find_query, function(err,result){
                if(err){
                    console.log(err);
                    res.jsonp(err);
                }else{console.log(result);
                    if(result.affectedRows==0) callback(null,0);
                    else callback(null,1);
                }
            });
 
        },function(isExist,callback){
            if(isExist==0){console.log("in1");
                var insert_query = 'insert into sight_score(score,sight_id,user_id) values('+score+','+sight_id+','+user_id+')';
                sqlconnection.query(insert_query, function(err,result){
                    if(err){
                        console.log(err);
                        res.jsonp(err);
                    }else{
                        callback(null,result);
                    }
                });
            }else {
                callback(null,null);
            }
        },function(res,callback){
            var find_query = 'select score from sight_score where sight_id='+sight_id;
            sqlconnection.query(find_query, function(err,result){
                if(err){
                    console.log(err);
                    res.jsonp(err);
                }else{console.log("in2");
                    var sum = 0.0;
                    for(var i=0;i<result.length;i++){
                        sum +=result[i].score;    
                    }
                    var average = (sum / result.length).toPrecision(2);
                    var update_query = 'update sight set score='+average+' where id='+sight_id;
                    sqlconnection.query(update_query, function(err,result){
                        if(err){
                            console.log(err);
                            res.jsonp(err);
                        }else{
                            callback(null,result);
                        }
                    });
                }
            });
        }
    ], function(err, result){
        if(err) {console.log(err)}
        else {
            res.jsonp({"isSuccess":"true"});
        }
    });
});

router.post('/commentcreate',function(req,res){
    var user_id = Number(req.body.userId);
    var sight_id = Number(req.body.sightId);
    var comment = req.body.comment;

    var milliseconds = req.body.date;

    var insert_query = 'insert into sight_comment(comment,date,sight_id,user_id) values("'+comment+'","'+milliseconds+'",'+sight_id+','+user_id+')';

    sqlconnection.query(insert_query, function(err,result){
        if(err){
            console.log(err);
            res.jsonp(err);
        }else{
            res.jsonp({"isSuccess":"true"});
        }
    });

});

router.get('/commentlist',function(req,res){
    var sight_id = Number(req.query['sightId']);

    var find_query = 'select C.id,U.profile,U.user_id,C.comment,C.date from sight_comment C left join user U on C.user_id=U.id where C.sight_id='+sight_id;

    sqlconnection.query(find_query, function(err,result){
        if(err){
            console.log(err);
            res.jsonp(err);
        }else{
            if(result.length == 0){
                res.jsonp([{"id":-1}]);
            }
            else { res.jsonp(result); }
        }
    });
});

router.get('/favoritelist',function(req,res){

    var user_id = Number(req.query['id']);

    var find_query = 'select F.sight_id,S.name,S.information,S.picture,S.locationX,S.locationY from favorite F left join sight S on F.sight_id=S.id where F.user_id='+user_id;

    sqlconnection.query(find_query, function(err,result){
        if(err){
            console.log(err);
            res.jsonp(err);
        }else{
            if(result.length == 0){
                res.jsonp([{"id":-1}]);
            }
            else { res.jsonp(result); }
        }
    });
});




module.exports = router;
