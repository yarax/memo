var express = require('express');
var app = express();
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var _ = require('lodash');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/memo');

var Card = require("./models/card");
app.use(serveStatic(__dirname + '/../public'));
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');


app.get('/', function(req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!'});
});

app.post('/api/card', function (req, res, next) {
    var card = new Card(req.body);
    card.save(function (err) {
        if (err) return next(err);
        res.json({ok: true});
    });
});

app.delete('/api/card/:id', function (req, res, next) {
    Card.remove({_id: req.params['id']}, function (err) {
        if (err) return next(err);
        res.json({ok: true});
    });
});

app.get('/api/categories', function (req, res, next) {
    Card.find({}, function (err, cards) {
        if (err) return next(err);
        var cats = _.uniq(cards.map(function (card) {return card.category}));
        res.json(cats);
    });
});

app.get('/api/cards', function (req, res, next) {
    Card.find({category: req.query.category}, function (err, cards) {
        if (err) return next(err);
        res.json(cards);
    });
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://localhost:3000');
});