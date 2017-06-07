var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var mysql_connection = require('./mysql.js');
var fs = require('fs');
var jsonFile = require('jsonfile');
var sqlconnection = mysql.createConnection( mysql_connection.forconnection() );
var multer = require('multer');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/*json to mysql*/
/*
router.get('/tomysql',function(req,res){
    var filenumber = req.query['number'];
    var filenames = ['./busan.json','./deogu.json','./incheon.json','./junlanam.json','./chungcheongbuk.json','./chungcheongnam.json','./deojeon.json','./gwangju.json','./jeoju.json','./junlabuk.json','./kangwon.json','./kyeongky.json','./kyeongsangbuk.json','./kyeongsangnam.json','./seojong.json','./seoul.json','./ulsan.json']

    for(var jj=0;jj<17;jj++){
    var i=0;

    var category = 'A';// A is sight, B is hotel, C is food, D is truck
    var image = '';
    var mapx = 0;
    var mapy = 0;
    var name = '';
    var information = ''; 
    var insert_query = '';

    var isFinish = 0;
    var isSkip = false;
   
    var filename = filenames[filenumber];

    jsonFile.readFile(filename,'utf8',function(err,data){
        if(err){
            console.log(err);
            res.json(err);
        }
        else {
            console.log("in");
            items = data['items']['item'];
            var numberofitem = items.length;
            var i =0;

            for(i=0;i<numberofitem;i++){
                isSkip = false;
                information = '';
                if(items[i].mapx == null) mapx = 0;
                else mapx =items[i].mapx;

                if(items[i].mapy == null) mapy = 0;
                else mapy =items[i].mapy;

                switch(items[i].cat1){
                    case 'A01':
                        category = 'A';
                        break;
                    case 'A03':
                        category = 'A';
                        break;
                    case 'A04':
                        category = 'A';
                        break;
                    case 'A02':
                        if(items[i].cat2 == 'A207' || items[i].cat2 == 'A208') {
                            isSkip = true;
                            break;
                        }else{
                            catagory = 'A';
                            break;    
                        }
                    case 'C01':
                        isSkip = true;
                        break;
                    case 'B02':
                        category = 'B';
                        break;
                    case 'A05':
                        category = 'C';
                        break;
                    default:
                        console.log(items[i]);
                        isSkip = true;
                        break;
                }

                if(isSkip == true){ 
                    isFinish++;
                    continue;
                }
                name = items[i].title;
                if(items[i].tel != null) information +='%tel='+items[i].tel+'%';
                if(items[i].addr1 != null) information += '%address='+items[i].addr1+'%';
                if(items[i].zipcod != null) information += '%zipcode='+items[i].zipcode+'%';

                if(items[i].firstimage == null) {
                    insert_query = 'insert into sight (name,location,type,information,locationX,locationY) values ("'+name+'","('+mapx+','+mapy+')","'+category+'","'+information+'","'+mapx+'","'+mapy+'")';
                }else {
                    image = items[i].firstimage;
                    insert_query = 'insert into sight (name,location,type,information,picture,locationX,locationY) values ("'+name+'","('+mapx+','+mapy+')","'+category+'","'+information+'","'+image+'","'+mapx+'","'+mapy+'")';
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
                })
            }
        }
    });
});
*/


/* change the information of account */
router.post('/setting', function(req,res,next){
    var id = req.body.id;
    var name = req.body.name;
    var password = req.body.password;
    var file = req.body.file;
    var update_query = "";
    
    if(password == null) {
        if(file == null){
            update_query = "update user set name = '"+name+"' where id = "+id;
        } else{
            update_query = "update user set name = '"+name+"', profile = '"+file+"' where id = "+id;
        }
    }
    else {
        if(file == null){
            update_query = "update user set name = '"+name+"', password = '"+password+"' where id = "+id;
        }else{
            update_query = "update user set name = '"+name+"', password = '"+password+"', profile = '"+file+"' where id = "+id;
        }
    }

    sqlconnection.query(update_query,function(err,result){
        if(err){
            console.log(err);
            res.jsonp(err);
        }
        else{
            if(result.affectedRows == 0) {
                res.jsonp({"isSuccess":"false"});
            }
            else {
                res.jsonp({"isSuccess":"true"});
            }

        }
    });
});


/* Login */
router.get('/login',function(req,res){

    var user_id = req.query['id'];
    var password = req.query['password'];
    var find_query = 'select id,user_id,name,profile from user where user_id='+mysql.escape(user_id)+' and password='+mysql.escape(password);    

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

/* Sign up */
router.post('/signup',function(req,res){
    var name = req.body.name;
    var user_id = req.body.id;
    var password = req.body.password;
    var file = req.body.file;
    var insert_query = 'insert into user (user_id,password,name,profile) values ("'+user_id+'","'+password+'","'+name+'","'+file+'")';
    sqlconnection.query(insert_query, function(err,result){
        if(err){ 
            console.log(err);
            res.jsonp(err);
        }
        else{
            res.jsonp({'isSuccess':'true'});
        }
    });
});


//sqlconnection.end();
module.exports = router;
