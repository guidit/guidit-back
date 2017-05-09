var express = require('express');
var router = express.Router();

//mysql conf
module.exports = (function() {
  return {
    local: {
        host : 'localhost',
        port: '22',
        user: 'cs20111237',
        password:'cs20111237',
        database:'guidit'
    },
  }
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
