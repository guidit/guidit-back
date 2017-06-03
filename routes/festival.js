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

/* INSERT festival information */
router.get('/tomysql',function(req,res){

    var i=0;

    var image = '';
    var mapx = 0;
    var mapy = 0;
    var name = '';
    var information = ''; 
    var insert_query = '';
    var period = ''; 

    var isFinish = 0;
   
    var filename = "festival.json";

    jsonFile.readFile(filename,'utf8',function(err,data){
        if(err){
            console.log(err);
            res.json(err);
        }
        else {
            items = data;
            var numberofitem = items.length;
            var i =0;

            for(i=0;i<numberofitem;i++){
                information = '';
                if(items[i].mapx == null) mapx = 0;
                else mapx =items[i].mapx;

                if(items[i].mapy == null) mapy = 0;
                else mapy =items[i].mapy;

                name = items[i].title;
                if(items[i].tel != null) information +='%tel='+items[i].tel+'%';
                if(items[i].addr1 != null) information += '%address='+items[i].addr1+'%';
                period = items[i].period;
                month = items[i].month;
                score = (Math.random() * 5).toFixed(3);

                if(items[i].firstimage == null) {
                    insert_query = 'insert into festival (name,date,month,locationX,locationY,information,score) values ("'+name+'","'+period+'","'+month+'","'+mapx+'","'+mapy+'","'+information+'","'+score+'")';
                }else {
                    image = items[i].firstimage;
                    insert_query = 'insert into festival (name,date,month,picture,locationX,locationY,information,score) values ("'+name+'","'+period+'","'+month+'","'+image+'","'+mapx+'","'+mapy+'","'+information+'","'+score+'")';
                }
                sqlconnection.query(insert_query,function(err,result){
                    if(err){
                        console.log(err);
                        res.jsonp(err);    
                    }else{
                        isFinish++;
                        if(numberofitem == isFinish){
                            res.jsonp("success");
                        }    
                    }
                });
            }
        }
    });
});

/* festival list */

router.get('/list',function(req,res){
    var month = req.query['month'];
    
    function sortDesc(a,b){ return b["score"]-a["score"]; }

    if(month<1 || month>12){
        res.jsonp([{"id":-1}])
    }
    else{
        var find_query = 'select id,name,date,date,picture,score from festival where month='+month;

        sqlconnection.query(find_query,function(err,result){
            if(err){
                console.log(err);
                res.jsonp(err);
            }else{
                res.jsonp(result.sort(sortDesc));
            }
        });
    }
});


module.exports = router;

















