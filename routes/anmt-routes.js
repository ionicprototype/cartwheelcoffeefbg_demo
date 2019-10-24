const router       = require('express').Router(),
      mongoose     = require('mongoose'),
      bodyParser   = require('body-parser'),
      methodOverride = require("method-override"),
      Announcement = require('../models/anmt-model');
      AuthChk      = require('../middleware/auth-check');

// @ROUTE POST /ANNOUNCEMENTS
// @DESC  CREATES NEW ANNOUNCEMENT
router.post('/', AuthChk, (req, res) => {
    //Creates new post from Announcement Modal
    Announcement.create(req.body.announcement, (err, newAnnouncement) => {
        if(err) {
            console.log("Error creating new announcement: " + err);
        } else {
            console.log("Success creating new announcement.");
            res.redirect('/');
        }
    });    
});

// @ROUTE PUT /ANNOUNCEMENTS/:ID/EDIT
// @DESC  UPDATES ANNOUNCEMENT TEXT TO NEW VALUE
router.put('/:id/edit', AuthChk, (req, res) => {
    Announcement.findByIdAndUpdate(req.params.id, {announcement: req.body.announcement.editedAnnouncement }, (err, updatedAnnouncement) => {
    console.log('ID: ' + req.params.id);
    console.log('Updated: ' + req.body.announcement.editedAnnouncement);
    if(err) {
        console.log("Error updating announcement.");
        res.redirect('/');
    } else {
        res.redirect("/");
    }       
    });
});

// @ROUTE DELETE /ANNOUNCEMENTS/:ID
// @DESC  REMOVES ANNOUNCEMENT FROM DB
router.delete("/:id", AuthChk, (req, res) => {
    Announcement.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            console.log("Error deleting entry: " & err);
            res.redirect("/");
        } else {
            res.redirect("/");
        }
    });
});

module.exports = router;