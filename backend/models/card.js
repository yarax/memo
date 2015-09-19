var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cardSchema = new Schema({
    q: String,
    a: String,
    category: String
});

module.exports = mongoose.model('Card', cardSchema);