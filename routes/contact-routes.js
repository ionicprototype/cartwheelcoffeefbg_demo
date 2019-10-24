//REQUIREMENTS
const router           = require('express').Router(),
      keys             = require('../config/keys'),
      expressSanitizer = require('express-sanitizer'),
      nodemailer       = require('nodemailer');

router.use(expressSanitizer()); // REMOVES JAVASCRIPT FROM CONTACT FORM

// NODEMAILER
const mailer = require('nodemailer').createTransport({
    service: 'Gmail',
    auth: {
      user: keys.nodemailer.fromAddress,
      pass: keys.nodemailer.password,
    }
  });
  
// @ROUTE GET /CONTACT
// @DESC  DISPLAYS CONTACT PAGE
router.get('/', (req, res) => {
  res.render('contact', {user: req.user});
});

// @ROUTE POST /CONTACT
// @DESC  SENDS CONTACT FORM INFORMATION THROUGH NODEMAILER TO SITE OWNER'S EMAIL
router.post('/', (req, res) => {
  let contactName = req.body.contact.name,
        contactEmail = req.body.contact.email,
        contactPhone = req.body.contact.phone,
        contactBody = req.sanitize(req.body.contact.body);
  mailer.sendMail({
      from: keys.nodemailer.fromAddress,
      to: keys.nodemailer.toAddress,
      subject: 'Website Inquiry',
      html: `Site Admin! ${contactName} (email: ${contactEmail}, phone: ${contactPhone}) has sent you the following through your website: ${contactBody}`
    }, (err, info) => {
      if (err) return res.status(500).send(err);
      res.redirect('/contact');
    });
});

module.exports = router;