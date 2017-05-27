var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var mysql_connection = require('./mysql.js');

var sqlconnection = mysql.createConnection( mysql_connection.forconnection() );


var jsonFile = require('jsonfile');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Guidit' });
});



router.get('/main',function(req,res){
    var id = req.query['id'];

    
});




module.exports = router;
