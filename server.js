var express = require('express');
var app = express();
var PORT = process.env.PORT || 8000;
var morgan = require('morgan');
var mongoose = require('mongoose');
var User = require('./app/models/user');
var bodyParser = require('body-parser');
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var path = require('path');

app.use(morgan('dev')); //middle ware the console logs every req
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);

//establishes connection to DB, the function confirms connection
mongoose.connect('mongodb://localhost:27017/app2', function(err){
    if(err){
        console.log('Not connected to DB ' + err);
    }else{
        console.log('Successfully connected to DB');
    }
});

app.get('*', function(req, res){
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(PORT, function(){
    console.log('Running the server on port ' + PORT);
});