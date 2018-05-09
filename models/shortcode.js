var mongoose = require('mongoose'),  
    Schema   = mongoose.Schema;

var ShortCodeSchema = new Schema({  
  title:      { type: String },
  code:       { type: String },
  tags:       { type: Array },
  user:       { type: Number },
  votes:      { type: Number },
  shortname:  { type: String },
  language:   { type: String },
  frameworks: { type: String },
  createdAt:  { type: Date }
});

module.exports = mongoose.model('shortcode', ShortCodeSchema); 