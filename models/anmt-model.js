const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// MONGOOSE SCHEMA
// @DESC SCHEMA FOR ANNOUNCEMENTS
const announcementSchema = new Schema({
    created: {type: Date, default: Date.now},
    announcement: String
});

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;