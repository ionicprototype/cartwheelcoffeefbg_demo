const router = require('express').Router();
const passport = require('passport');

//successRedirect: '/', { failureRedirect: '/', failureFlash: "User does not have sufficient access." }

// @ROUTE GET /AUTH/LOGIN
// @DESC  REDIRECTS TO GOOGLE PLUS LOGIN
router.get('/login', (req, res) => {
    res.redirect('/google');
});

// @ROUTE GET /AUTH/LOGOUT
// @DESC  LOGS CURRENT GOOGLE-PLUS USER OUT
router.get('/logout', (req, res) => {
    //handle with Passport
    console.log('Logging out.');
    req.logout();
    res.redirect('/');
});

// @ROUTE GET /AUTH/GOOGLE
// @DESC  REDIRECTS TO GOOGLE PLUS LOGIN PAGE
router.get('/google',
  passport.authenticate('google', 
  { scope: ['profile'] 
}));

// @ROUTE GET /AUTH/GOOGLE/REDIRECT
// @DESC  REDIRECT FROM GOOGLE PLUS, DETERMINES IF USER HAS ACCESS TO SITE ADMIN PRIVILEGES
router.get('/google/redirect', passport.authenticate('google', { failureRedirect: "/"}), (req, res) => {
    // Successful authentication, redirect home.
    console.log('user logged in');
    res.redirect('/');
  });

module.exports = router;