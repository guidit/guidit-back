var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var mysql_connection = require('./mysql.js');
//mysql conf

//console.log(mysql_connection.forconnection());
var sqlconnection = mysql.createConnection( mysql_connection.forconnection() );

/*json to mysql*/
router.post('/tomysql',function(req,res){
    var items = req.body.item;
    var numberofitem = items.length;
    var i=0;

    var category = 'A';// A is sight, B is hotel, C is food, D is truck
    //var contentid = 0;
    var image = '';
    var mapx = 0;
    var mapy = 0;
    var name = '';
    var information = ''; 
    var insert_query = '';

    var isFinish = 0;
    var isSkip = false;
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
            insert_query = 'insert into sight (name,location,type,information) values ("'+name+'","('+mapx+','+mapy+')","'+category+'","'+information+'")';
        }else {
            insert_query = 'insert into sight (name,location,type,information,picture) values ("'+name+'","('+mapx+','+mapy+')","'+category+'","'+information+'","'+image+'")';
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
    //res.jsonp("success");
});


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
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
	console.log('wow!');
    var insert_query = 'insert into user (user_id,password,name,profile) values ("'+user_id+'","'+password+'","'+name+'","testprofile")';
	console.log('here?');
    sqlconnection.query(insert_query, function(err,result){
	console.log('or here?');
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


//sqlconnection.end();
module.exports = router;
