import dotenv from 'dotenv/config';
import express from 'express';
import hbs from 'hbs';
import bodyParser from 'body-parser';
import routes from './routes/routes.js';
import authRouter from './routes/auth.js';
import db from './models/db.js';
import session from 'express-session';
import flash from 'connect-flash';
import MongoStore from 'connect-mongo';
import mongoose from './models/connection';
import fileUpload from 'express-fileupload';
import { envPort, sessionKey } from './config';
const app = express();
app.use(bodyParser.urlencoded({ extended: true}));

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static('public'));
app.use(fileUpload());

db.connect();

app.use(session({
    secret: sessionKey,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 },
    rolling: true
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

app.use('/', routes);
app.use('/', authRouter);


app.listen(envPort, 'Localhost', function(){
    console.log('Connected to Localhost:3000');
})

