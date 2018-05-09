var express = require("express"),  
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
    mongoose = require('mongoose');
    mongoose.Promise = global.Promise;


// Connection to DB
mongoose.connect('mongodb://shortcoder:12X00!#sqS77@shortcodecluster-shard-00-00-smq7f.mongodb.net:27017,shortcodecluster-shard-00-01-smq7f.mongodb.net:27017,shortcodecluster-shard-00-02-smq7f.mongodb.net:27017/test?ssl=true&replicaSet=shortcodecluster-shard-0&authSource=admin', function(err, res) {
  if(err) throw err;
  console.log('Connected to Database');
});

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.all('*', function(req, res, next) {
       res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Headers", "X-Requested-With");
       res.header('Access-Control-Allow-Headers', 'Content-Type');
       next();
});
// Import Models and controllers
var models     = require('./models/shortcode')(app, mongoose);
var CodeCtrl = require('./controllers/shortcode');


// API routes
var codes = express.Router();

codes.route('/code')
    .get(CodeCtrl.findLastTen)
    .post(CodeCtrl.addCode);

codes.route('/code/count')
    .get(CodeCtrl.codesCount);

codes.route('/code/:s')
    .get(CodeCtrl.findString);

codes.route('/code/s/')
    .post(CodeCtrl.findStringPOST);

codes.route('/code/delete/')
    .post(CodeCtrl.deleteCode);

codes.route('/code:id')
    .get(CodeCtrl.findById);

codes.route('/code/vote')
    .post(CodeCtrl.addVote);

codes.route('/get_code/:title')
    .get(CodeCtrl.findByTitle);

codes.route('/get_code_tag/:tags')
    .get(CodeCtrl.findByTag);

codes.route('/job')
    .get(CodeCtrl.jobs);

app.use('/api', codes);



//heroku port
var port = process.env.PORT || 8080;

// Start server
app.listen(port, function() {
  console.log("Node server running on http://localhost:" + port);
});




