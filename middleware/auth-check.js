const authCheck = (req, res, next) => {
    if(!req.user) {
        console.log('user is not logged in');
        res.redirect('/');
    } else {
        console.log('user is logged in and may edit site');
        next();
    }
}

module.exports = authCheck;