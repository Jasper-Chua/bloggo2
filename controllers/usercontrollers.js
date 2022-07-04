import userModel from '../models/UsersModel.js';
import Comments from '../models/comments.js';
import Likes from '../models/likes.js';
import Post from '../models/article.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import db from '../models/db.js'; 
import ObjectId  from ('mongodb').ObjectId;  

exports.registerUser = (req, res) => {

  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const { username, email, password, birthday, phone, gender, description } = req.body;
    if (gender == 'male'){
      avatar = '/images/male.jpg';
    } else {
      avatar = '/images/female.jpg';
    }
    
    db.findOne(userModel, { email: email }, {}, function (result) {
      if (result) {
        req.flash('error_msg', 'Email is already in use.');
        res.redirect('/register');
      } else {
        db.findOne(userModel, { username: username }, {}, function (result) {  
          if (result) {
            req.flash('error_msg', 'Username is already in use.');
            res.redirect('/register');
          } else {
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, (err, hashed) => {
            const newUser = {
              username,
              email,
              password: hashed,
              birthday,
              gender,
              phone,
              description,
              avatar
            };
            db.insertOne(userModel, newUser, function (result) {
              if (!result) {
                req.flash('error_msg', 'Error!!! Please try again.');
                res.redirect('/register');
              } else {
                req.flash('success_msg', 'You are now Registered');
                res.redirect('/register');
              }
            });
            });
          }
        })
      }
    });
  } else {
    const messages = errors.array().map((item) => item.msg);
    req.flash('error_msg', messages.join(' '));
    res.redirect('/register');
  }
};

exports.loginUser = (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const { email, password } = req.body;

    db.findOne(userModel, { email: email }, {}, function (user) {
      if (!user) {
        req.flash('error_msg', 'Error!!! Please try again.');
        res.redirect('/login');
      } else {
          user.toObject();
          bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
              req.session.user = user._id;
              req.session.name = user.username;
              res.redirect('/');
            } else {
              req.flash('error_msg', 'Incorrect password.');
              res.redirect('/login');
            }
          });
      }
    });
  } else {
    const messages = errors.array().map((item) => item.msg);
    req.flash('error_msg', messages.join(' '));
    res.redirect('/login');
  }
};

exports.updateUser = (req, res) => {  
  const errors = validationResult(req);

  var currentname = req.session.name
  
  if(errors.isEmpty()) {
    var id = new ObjectId(req.session.user);

    const { username, phone, description, password } = req.body;
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hashed) => {
      const updateuser = {
        username: username,
        phone: phone,
        description: description,
        password: hashed,
      };
      console.log(username)
      console.log(currentname)
      db.updateMany(Comments, {user: currentname}, username, function(result){
        if (result) {
          console.log(result)
          db.updateMany(Post, {owner: currentname}, username, function(result) {
            if (result) {
              console.log(id)
              db.updateOne(userModel, {_id: id}, updateuser, function (result) {
                if(result) {
                  req.session.name = req.body.username
                  console.log('Success');
                  req.body.success_msg = 'Update is a Success';
                  var body = req.body;
                  res.render('editprofile', {body: body, loggedin : true, name: req.session.name});
                } else {
                  req.flash('error_msg', 'Failed to Update');
                  res.redirect('/editprofile', req.body);
                }
              })
            }
          })
        }
      })
    });
  } else {
    const messages = errors.array().map((item) => item.msg);
    req.flash('error_msg', messages.join(' '));
    res.redirect('/editprofile');
  }
}

exports.deleteUser = (req, res) => {
    
    var username = req.session.name;
    var owner = req.session.name;
    var user = req.session.name;

    if (req.session) {
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
          db.deleteMany(Comments, {user: user}, function(result) {
            if(result) {
              db.deleteMany(Post, {owner: owner}, function(result){
                if (result) {
                  db.deleteOne(userModel, {username:username}, function(result){
                    if (result) {
                      res.redirect('/');
                    } else {
                      req.flash('error_msg', 'Failed to Delete');
                      req.redirect('/editprofile');
                    }
                  })
                } else {
                  req.flash('error_msg', 'Failed to Delete all Blog Posts');
                  req.redirect('/editprofile');
                }
              })
            }
          })
      });
    }
}

exports.logoutUser = (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/login');
    });
  }
};