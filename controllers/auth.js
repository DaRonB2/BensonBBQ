const express = require('express');
const router = express.Router();
const passport = require('../config/passport-config');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// import the user model
const { User } = require('../models');
const { Blog } = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');
const { findOne } = require('../models/user');

//====== GET ROUTES =====
//----- SIGNUP PAGE -----
router.get('/signup', (req, res) => {
    res.render('auth/signup', {});
});

//----- LOGIN PAGE -----
router.get('/login', (req, res) => {
    res.render('auth/login', {});
});

// ---- LOGOUT -----
router.get('/logout', (req, res) => {
    res.locals.currentUser = null;
    req.logOut((error, next) => {
        if (error) {
            req.flash('error', 'Error logging out. Please try again.');
            return next(error);
        }
        req.flash('success', 'Logging out... See you next time!');
        res.redirect('/');
    })
});

// ====== POST ROUTES ===== 
router.post('/signup', urlencodedParser, async (req, res) => {
    const { name, email, phone, password } = req.body;
    try {
        const findUser = await User.findOne({ email: req.body.email });
        if (!findUser) {
            const newUser = await User.create({
                name: name,
                email: email,
                phone: phone,
                password: password
            });
            console.log('----- NEW USER ----\n', newUser);
            passport.authenticate('local', {
                successRedirect: '/profile',
                successFlash: `Welcome ${newUser.name}! Account created.`
            })(req, res);
        } else {
            req.flash('error', 'Email already exists. Try another email');
            res.redirect('/auth/signup');
        }
    } catch (error) {
        console.log('----- ERROR IN SIGNUP POST ----', error);
        if (error.errors.phone.name === 'ValidatorError') {
            req.flash('error', 'Phone number needs to be in XXX-XXX-XXXX format');
            res.redirect('/auth/signup');
        }
    }
});

    

router.post('/login', urlencodedParser, passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/auth/login',
    successFlash: 'Welcome back to your account!',
    failureFlash: 'Either your email or password is incorrect, please try again.'
}), (req, res) => {

});

module.exports = router;