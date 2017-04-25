var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^(([a-zA-Z]{2,30})+[ ]+([a-zA-Z]{2,30})+)+$/,
        message: 'Please provide name in standard format, eg. John Doe.'
    })
];

var emailValidator = [
    validate({
        validator: 'isEmail',
        message: 'Not a valid e-mail.'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 30],
        message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];

var usernameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 30],
        message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters.'
    }),
    validate({
        validator: 'isAlphanumeric',
        message: 'Username must contain letters and numbers only.'
    })
];

var passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?=.*?[a-zA-Z])(?=.*?[\d])(?=.*?[\W]).{8,16}$/,
        message: 'Password must be 8 to 16 characters, contain upper and lower case letters, atleast one number, one special character, and no spaces.'
    }),
    validate({
        validator: 'isLength',
        arguments: [8, 16],
        message: 'Password must be 8 to 16 characters, contain upper and lower case letters, atleast one number, one special character, and no spaces.'
    })
]

var UserSchema = new Schema({
    name: {type: String, required: true, validate: nameValidator, unique: false},
    username: {type: String, lowercase: true, required: true, unique: true, validate: usernameValidator},
    password: {type: String, required: true, validate: passwordValidator},
    email: {type: String, required: true, lowercase: true, unique: true, validate: emailValidator}
});

UserSchema.pre('save', function(next){
    var user = this;
    bcrypt.hash(user.password, null, null, function(err, hash){
        if(err) return next(err);
        user.password = hash;
        next();
    });
});

UserSchema.plugin(titlize, {
    paths:['name']
});

UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);