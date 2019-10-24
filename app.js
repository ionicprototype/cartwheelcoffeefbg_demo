//REQUIREMENTS
const express        = require('express'),
    fs               = require('fs'),
    async            = require('async'),
    app              = express(),
    bodyParser       = require('body-parser'),
    mongoose         = require('mongoose'),
    methodOverride = require('method-override'),
    Grid             = require('gridfs-stream'),
    cookieSession    = require('cookie-session'),
    passport         = require('passport');   

// LOGIN-PASSPORT
// @DESC GENERAL KEYS/GOOGLE-PASSPORT LOGIN INFORMATION
const  keys          = require('./config/keys'),
       passportSetup = require('./config/passport-setup');
// ROUTE DIRECTORIES
// @DESC INCLUDES ALL DIRECTORIES THAT CONTAIN ROUTES    
const authRoutes    = require('./routes/auth-routes'),
      anmtRoutes    = require('./routes/anmt-routes'),
      contactRoutes = require('./routes/contact-routes'),
      imageRoutes   = require('./routes/image-routes');

// MONGODB
// @DESC CONNECT TO MONGO DB
mongoose.connect(keys.mongoDB.dbURI, { useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log('Connected to MongoDB');
});
const conn = mongoose.createConnection(keys.mongoDB.dbURI, { useNewUrlParser: true, useUnifiedTopology: true});

// MONGOOSE MODEL
// @DESC ANNOUNCEMENTS MODEL
const Announcement = require('./models/anmt-model')

// COOKIES
// @DESC SET UP COOKIE SESSION FOR GOOGLE+ LOGIN
app.use(cookieSession({ 
  maxAge: 24 * 60 * 60 * 1000, 
  keys: [keys.session.cookieKey],
  sameSite: 'strict'
}));

// PASSPORT
// @DESC SETUP PASSPORT SESSION
app.use(passport.initialize());
app.use(passport.session());
// MIDDLEWARE
app.set('view engine', 'ejs');
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.json(), bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method')); //allows _method as a PUT OR DELETE request

// GRIDFS
// @DESC INITIALIZE GRIDFS CONNECTION FOR DATABASE
let gfs;
conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});
// ROUTES
//--------------------------------------------------------
// @ROUTE GET INDEX
// @DESC RENDERS HOME PAGE WITH ANNOUNCEMENTS/IMAGES FROM DATABASE
app.get('/', (req, res) => {
  let announcements;
  let files;

  async.series([(callback) => {
    Announcement.find({}, (err,allAnnouncements) => {
            if(err) return callback(err);
            announcements = allAnnouncements;
            callback(null, allAnnouncements);
        })
    }, (callback) => {
    gfs.files.find().toArray((err, allFiles) => {
      if(err) return callback(err);
      // Check if files
      if (!allFiles || allFiles.length === 0) {
        files = false;
        console.log('No files found.');
      } else {
        allFiles.map(file => {
          if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            file.isImage = true;
          } else {
            file.isImage = false;
          }
        });
        files = allFiles;
      }
      callback(null,allFiles);
    })}
    ], (err) => {
        res.render('index', {announcements: announcements, files: files, user: req.user});
    });
});
// @ROUTE /AUTH
// @DESC GOOGLE PLUS LOGIN ROUTES
app.use('/auth', authRoutes); // Google authorization routes
// @ROUTE /ANNOUNCEMENTS
// @DESC ANNOUNCEMENT PATHS FOR HOME PAGE
app.use('/announcements', anmtRoutes); // Announcement routes
// @ROUTE /CONTACT
// @DESC CONTACT PAGE/FORM ROUTES
app.use('/contact', contactRoutes); // Contact page routes
// @ROUTE /IMAGE
// @DESC IMAGE PATHS FOR HOME PAGE
app.use('/image', imageRoutes); // Image routes for index page

// @ROUTE GET /ABOUT
// @DESC SHOWS ABOUT PAGE
app.get('/about', (req, res) => {
  res.render('about', {user: req.user});
});
// @ROUTE GET MENU ROUTE
// @DESC SHOW MENU PAGE
app.get('/menu', (req, res) => {
  res.render('menu', {user: req.user});
});

app.listen('3000' || process.env.port, '127.0.0.1' || process.env.IP, () => {
    console.log('Server running!');
});