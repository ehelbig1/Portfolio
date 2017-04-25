var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = '2125';

module.exports = function(router){
    // http://localhost:8000/api/users
    // USER REGISTRATION ROUTE
    router.post('/users', function(req, res){
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    user.name = req.body.name;
    if(req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '' || req.body.name == null || req.body.name == ''){
        res.json({success: false, message: 'Please insure all fields are provided.'});
    }else{
        user.save(function(err){
            if(err){
                if(err.errors != null){
                    if(err.errors.name){
                        res.json({success: false, message: err.errors.name.message});
                    }else if(err.errors.email){
                        res.json({success: false, message: err.errors.email.message});
                    }else if(err.errors.username){
                        res.json({success: false, message: err.errors.username.message});
                    }else if(err.errors.password){
                        res.json({success: false, message: err.errors.password.message});
                    }
                }else if(err){
                    if(err.code === 11000){
                        if(err.errmsg[57] === 'u'){
                            res.json({success: false, message: 'Username already exists.'})
                        }else if(err.errmsg[57] === 'e'){
                            res.json({success: false, message: 'E-mail already exists.'})
                        }
                    }
                }
            }else{
                res.json({success: true, message: 'User created!'});
            }
        });
    }
})

    //USER LOGIN ROUTE
    // http://localhost:8000/api/authenticate
    router.post('/authenticate', function(req, res){
        User.findOne({username: req.body.username}).select('email username password').exec(function(err, user){
            if(err) throw err;

            if(!user){
                res.json({success: false, message: 'Could not authenticate user.'});
            }else if(user){
                if(req.body.password){
                    var validPassword = user.comparePassword(req.body.password);
                    if(!validPassword){
                        res.json({success: false, message: 'Could not authenticate password.'});
                    }else{
                        var token = jwt.sign({username: user.username, email: user.email}, secret, {expiresIn: '24h'});
                        res.json({success: true, message: 'User authenticated.', token: token});
                    }
                }else {
                    res.json({success: false, message: 'Password not provided.'});
                }
            }
        });
    });

    router.use(function(req, res, next){

        var token = req.body.token || req.body.query || req.headers['x-access-token'];

        if(token){
            jwt.verify(token, secret, function(err, decoded){
                if(err){
                    res.json({success: false, message: 'Token invalid.'})
                }else{
                    req.decoded = decoded;
                    next();
                }
            })
        }else{
            res.json({success: false, message: 'No token provided.'})
        }
    });

    router.post('/me', function(req, res){
        res.send(req.decoded);
    })

    return router;
}