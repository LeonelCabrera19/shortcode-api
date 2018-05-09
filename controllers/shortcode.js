//File: controllers/tvshows.js
var mongoose = require('mongoose');  
var slug = require('slug');
var shortcode  = mongoose.model('shortcode');

//GET - Return all codes in the DB
exports.findAllCodes = function(req, res) {  
    shortcode.find(function(err, shortcodes) {
    if(err) res.send(500, err.message);
        console.log('GET /shortcode')
        res.status(200).jsonp(shortcodes);
    });
};

//GET - Return all codes in the DB
exports.findString = function(req, res) {
    var str = req.params.s;
    var strArray = str.split(" ");
    var find_result;

    var arrayRegex = [];
    strArray.forEach(function(opt){
            arrayRegex.push(  new RegExp(opt, "i") );
    });

    shortcode.find({tags: { $all: arrayRegex }}, function(err, shortcodes){
        if(err) return res.send(500, err.message);
        console.log('GET /code/s=' + req.params.s);
        find_result = shortcodes;

        console.log(find_result.length);
        if(find_result.length==0){
            shortcode.find({tags: { $in: arrayRegex }}, function(err, shortcodes){
                if(err) return res.send(500, err.message);
                console.log('GET /code/s=' + req.params.s);
                find_result = shortcodes;
                res.status(200).jsonp(find_result);
            });
        }
        else{
            res.status(200).jsonp(find_result);
        } 
    });
   
    
};

//POST - Return all codes in the DB
exports.findStringPOST = function(req, res) {
    var str = req.body.s;
    var strArray = str.split(" ");
    var find_result;

    var arrayRegex = [];
    strArray.forEach(function(opt){
            arrayRegex.push(  new RegExp(opt, "i") );
    });

    shortcode.find({tags: { $all: arrayRegex }}, function(err, shortcodes){
        if(err) return res.send(500, err.message);
        console.log('GET /code/s=' + req.params.s);
        find_result = shortcodes;

        console.log(find_result.length);
        if(find_result.length==0){
            shortcode.find({tags: { $in: arrayRegex }}, function(err, shortcodes){
                if(err) return res.send(500, err.message);
                console.log('GET /code/s=' + req.params.s);
                find_result = shortcodes;
                res.status(200).jsonp(find_result);
            });
        }
        else{
            res.status(200).jsonp(find_result);
        } 
    });
   
    
};

//GET - Return Code with specified ID
exports.findById = function(req, res) {
	shortcode.findById(req.params.id, function(err, shortcodes) {
    if(err) return res.send(500, err.message);

    console.log('GET /shortcode_id/' + req.params.id);
		res.status(200).jsonp(shortcodes);
	});
};

//GET - Return a Code with specified Title
exports.findByTitle = function(req, res) {
    shortcode.find({ "title": { "$regex": req.params.title , "$options": "i" } }, function(err, shortcodes) {
    if(err) return res.send(500, err.message);
    console.log('GET /code_title/' + req.params.title);
		res.status(200).jsonp(shortcodes);
	});
};

//GET - Return a Code with specified Tag
exports.findByTag = function(req, res) {
    shortcode.find({tags: { $all: [req.params.tags] }}, function(err, shortcodes){
        if(err) return res.send(500, err.message);
        console.log('GET /code_title/' + req.params.title);
		res.status(200).jsonp(shortcodes);
    });
};

//POST - Return a code with multi tags
exports.findMultiTag = function(req, res){
    tags = req.body.tags;
    console.log(req.body.tags);
    shortcode.find({tags: { $all: req.body.tags }}, function(err, shortcodes){
        if(err) return res.send(500, err.message);
        console.log('GET /code_get_tags/');
		res.status(200).jsonp(shortcodes);
    });
}

//GET - Last Ten Values
exports.findLastTen = function(req, res){
    shortcode.find({}, function(err, shortcodes){
        if(err) return res.send(500, err.message);
        console.log('GET /code_last_ten/');
		res.status(200).jsonp(shortcodes);
    }).limit(10)
    .sort({_id: -1});
}

//GET - Count of codes
exports.codesCount = function(req, res){
    shortcode.find({}, function(err, shortcodes){
        if(err) return res.send(500, err.message);
        console.log('GET /code_last_ten/');
		res.status(200).jsonp(shortcodes.length);
    });
}

//POST - Insert a new code in the DB
exports.addCode = function(req, res) {
	var title = req.body.title;
  var tags_from_title = title.split(" ");
  var special_tags = req.body.tags;
  var tags = tags_from_title.concat(special_tags);
  var code = new shortcode({
    title:      req.body.title,
    code:       req.body.code,
    tags:       tags,
    user: 	    req.body.user,
    shortname:  slug(req.body.title, {lower: true}),
    language:   req.body.language,
    frameworks: req.body.framework,
    createdAt:  Date.now(),
    votes:      0
  });
  console.log(code);
  
	code.save(function(err, result) {
		if(err) return res.status(500).send(err.message);
    res.status(200).jsonp(result);
	});
};

exports.jobs = function(req, res) {
    var request = require('request');
    request('http://api.indeed.com/ads/apisearch?publisher=5335543508963115&q=java&l=austin%2C+tx&sort=&radius=&st=&jt=&start=&limit=&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var parser = require('xml2json');
            console.log("input -> %s", body);
            var json = parser.toJson(body);
            var jsonParsed = JSON.parse(json);
            
            res.status(200).jsonp(["jobs", jsonParsed['response']['results']['result']]);
        }
    });
}

exports.addVote = function(req, res){
    var code_id = req.body.code;
    console.log(code_id);
    if (code_id.match(/^[0-9a-fA-F]{24}$/)) {
        shortcode.findById(code_id, function(err, shortcodes) {
            shortcodes.votes = 1 + shortcodes.votes;
            shortcodes.save(function(err) {
                res.status(200).jsonp(['votes', shortcodes.votes]);
                console.log(['votes', shortcodes.votes]);
            });
        });
    }else{
        res.status(200).jsonp('Incorrect ID!');
    }
}

//Delete Code With Id
exports.deleteCode = function(req,res){
    var code_id = req.body.code;
    if (code_id.match(/^[0-9a-fA-F]{24}$/)) {
        shortcode.findById(code_id).remove().exec();
        res.status(200).jsonp('deleted id:' + code_id);
    }else{
        res.status(200).jsonp('Incorrect ID!');
    }
   
}
