# Cartwheel Coffee FBG - Demo

Cartwheel Coffee FBG is a full-stack RESTful web application built for a local business using: Nodejs/Express (back-end) and HTML5/CSS3/Javascript/Bootstrap(jQuery) (front-end). Additional functionality includes login via Google OAuth 2.0 to allow an administrator (via Passport/Google Plus) to login and post announcements (MongoDB), upcoming Google calendar events (Google Calendar API), and a custom image gallery (MongoDB/GridFS/Multer).

## Requirements

In order to properly use this application, you will need access to the following:
- MongoDB agent (local or DB Atlas)
- Gmail Account (API calls for local admin access via OAuth 2.0 and Google Calendar API calls)

## Back-End Dependencies

Server-side dependencies required to run the application properly at the time of release are: 

|     npm Package Name    | Version |   Use  |
|:-----------------------:|:-------:|:------:|
|          async          | 3.1.0   | Text   |
|       body-parser       | 1.19.0  | Text   |
|      cookie-session     | 1.3.3   | Text   |
|         crypto          | 1.0.1   | Text   |
|           ejs           | 2.7.1   | Text   |
|         express         | 4.17.1  | Text   |
|     express-sanitizer   | 1.0.5   | Text   |
|           fs            | 0.0.1   | Text   |
|        googleapis       | 43.0.0  | Text   |
|      gridfs-stream      | 1.1.1   | Text   |
|     method-override     | 3.0.0   | Text   |
|        mongoose         | 5.7.1   | Text   |
|         multer          | 1.4.2   | Text   |
|  multer-gridfs-storage  | 3.3.0   | Text   |
|        nodemailer       | 6.3.0   | Text   |
|        nodemon          | 1.19.2  | Text   |
|        passport         | 0.4.0   | Text   |
| passport-google-oauth20 | 2.0.0   | Text   |

## Configuring the App

Prior to usage, the following files will need to updated:

### [./config/keys.js](config/keys.js)

```javascript
google: {
    clientID: 'userSupplied',     //GOOGLE-PLUS-CLIENT ID
    clientSecret: 'userSupplied', //GOOGLE-PLUS-CLIENT SECRET
    allowNewUser: false           // PASSPORT-GOOGLE-OAUTH (ALLOWS NEW USER)
},
mongoDB: {
    dbURI: 'userSupplied' // MONGO-URI-ADDRESS
},
session: {
    cookieKey: 'userSupplied' // GOOGLE-PLUS-COOKIE-SESSION-KEY
},
nodemailer: {
    fromAddress: 'userSupplied@address.com', // NODEMAILER-FROM-ADDRESS
    password: 'userSupplied',                // NODEMAILER-FROM-PASSWORD
    toAddress: 'userSupplied@address.com'   // NODEMAILER-TO-PASSWORD
}
```
Google: clientID/clientSecret are generated when creating an OAuth 2.0 client ID key using for Google Plus; additional information on creating this is found [here](https://developers.google.com/adwords/api/docs/guides/authentication#webapp). The 'allowNewUser' key-value when set to false prevents new users from signing up as an admin. This needs to be set to true prior to initialization to allow creation of a new admin, and then disabled immediately by setting the value to false.

Session: 'cookieKey' is determined by the admin(s) of the site.

nodemailer: The 'fromAddress'/'toAddress' key-value pairs are used by Nodemailer on the 'Contact' view; the 'password' key-value is the same as used to normally login the 'fromAddress' account. The form on the 'Contact' view uses this to send queries to site admin(s) who control the 'toAddress'.

### [./public/scripts/index.js](public/scripts/index.js)

```javascript
// LOGIN INFO FOR GOOGLE CALENDAR API
'apiKey': 'API_KEY'
...
// GOOGLE CALENDAR INFORMATION
"calendarId" : 'CALENDAR_ID',
```

The API key/calendar ID are both strings provided by the primary gmail account designated as the admin. The 'API_KEY' is the API key generated using the Google Developer's console for calendar permissions; help configuring the key is found [here](https://support.google.com/googleapi/answer/6158862?hl=en). The 'CALENDAR_ID' is made when creating the Google calendar to track.