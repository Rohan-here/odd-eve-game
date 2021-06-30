if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const { execArgv, nextTick } = require('process');
const Joi = require('joi');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Player = require('./models/player');
const { join } = require('path');

const flash = require('connect-flash');
const passport = require('passport');
const LocalStratergy = require('passport-local');
const Review = require('./models/review');
const sanitize = require('express-mongo-sanitize');
const dbURL = process.env.DB_URL;
const session = require('express-session');

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => {
        console.log("Connected Mongo Successfully")
    })
    .catch(err => {
        console.log("Uh Oh couldnt connect mongo!!")
        console.log(err);
    })


app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/resources')));
app.use(express.static(path.join(__dirname, '/server')));



app.use(session({
    name: "blah",
    secret: 'this is secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(sanitize({
    replaceWith: ':('
}));


passport.use(new LocalStratergy(Player.authenticate()));

passport.serializeUser(Player.serializeUser());
passport.deserializeUser(Player.deserializeUser());

app.use(async (req, res, next) => {

    res.locals.currentUser = await req.user;
    next();

})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}











app.get('/register', async (req, res) => {
    try {
        await res.render('register', { messages: req.flash('info') });
    } catch (e) {
        await res.redirect('/error');
    }
})

app.post('/registerUser', async (req, res) => {
    try {
        const userSchemaValid = Joi.object({
            username: Joi.string()
                .alphanum()
                .min(3)
                .max(30)
                .required(),

            pswd: Joi.string()
                .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
                .required(),

            cpswd: Joi.string()
                .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
                .required().valid(Joi.ref('pswd')),
            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
                .required()
        })

        const emailValid = Joi.object({
            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
                .required()
        })


        const body = req.body;
        const result = userSchemaValid.validate(body);
        const mailToBeChecked = { email: body.email };
        const emailCheck = emailValid.validate(mailToBeChecked);
        if (!emailCheck.error) {
            const saved = await Player.findOne({ email: body.email });
            if (saved) {
                console.log(saved);
                req.flash('info', `Email already exists`);
                res.redirect('/register');
            }
            else if (result.error) {
                const err = result;
                console.log(err);
                req.flash('info', `Passwords didn't match`);
                res.redirect('/register');
            }
            else {
                const user = new Player({ username: body.username, email: body.email });
                const newUser = await Player.register(user, body.pswd)
                res.redirect('/login');
            }
        }
        else {
            console.log(emailCheck);
            req.flash('info', `Invalid Username or Email`);
            res.redirect('/register');
        }
    } catch (e) {
        res.redirect('/error');
    }
})


app.get("/login", (req, res) => {
    try {
        req.logOut();
        res.render("login", { messages: req.flash('info') });
    } catch (e) {
        res.redirect('/error');
    }
})

app.post("/loginUser", passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    try {
        res.redirect("/home");
    } catch (e) {
        res.redirect('/error');
    }
})


app.get('/playerActive', isLoggedIn, async (req, res) => {
    try {
        const user = await Player.findById(req.user._id);
        user.populate('scores');
        res.render('playerActive');
    } catch (e) {
        res.redirect('/error');
    }
})

app.get('/logout', isLoggedIn, (req, res) => {
    try {
        req.logOut();
        res.redirect('/home');
    } catch (e) {
        res.redirect('/error');
    }
})
app.get('/game', isLoggedIn, (req, res) => {
    try {
        res.render('game');
    } catch (e) {
        res.redirect('/error');
    }
})

app.get('/dev', (req, res) => {
    res.render('dev');
})

app.post('/saveReview', async (req, res) => {
    const review = new Review(req.body);
    await review.save();
    res.redirect('/dev');
})

app.post('/saveScores', isLoggedIn, async (req, res) => {
    try {
        const body = req.body;
        console.log(body);
        const player = await Player.findById(req.user._id);
        const score = { score: body.returnScore, target: body.returnTarget };
        player.scores.push(score);
        await player.save();
        if (body.savescoreButton === "replay") {
            console.log("going to game");
            res.redirect('/game');
        } else if (body.savescoreButton === "goHome") {
            console.log("going to home");
            res.redirect('/home');
        }
        else {
            res.redirect('/error');
        }
    } catch (e) {
        res.redirect('/error');
    }
})



app.get('/error', (req, res) => {
    req.logOut();
    res.render('error');
})



app.get('/home', (req, res) => {
    try {
        res.render('home');
    } catch (e) {
        res.redirect('/error');
    }
})

app.get('/', (req, res) => {
    res.redirect('/home');
})

app.get('/test', (req, res) => {
    res.render('navtest');
})
app.get('*', (req, res) => {
    res.render('end');
})


var port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log("Listening on PORT 4000");
})


