module.exports = {
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
}