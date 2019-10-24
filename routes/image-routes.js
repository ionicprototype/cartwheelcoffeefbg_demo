//REQUIREMENTS
const router         = require('express').Router(),
      crypto         = require('crypto'),
      mongoose       = require('mongoose'),
      path           = require('path'),
      multer         = require('multer'),
      GridFsStorage  = require('multer-gridfs-storage'),
      Grid           = require('gridfs-stream'),
      AuthChk        = require('../middleware/auth-check'),
      keys           = require('../config/keys');

const conn = mongoose.createConnection(keys.mongoDB.dbURI, {useNewUrlParser: true, useUnifiedTopology: true});

// INITIALIZE GRIDFS(GFS)
let gfs;
conn.once('open', () => {
  // INITIALIZE STREAM
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// CREATE STORAGE ENGINE
const storage = new GridFsStorage({
  url: keys.mongoDB.dbURI,
    file: (req, file) => {
      if(file.mimetype === 'image/jpeg') {
        return new Promise((resolve, reject) => {
          crypto.randomBytes(16, (err, buf) => {
            if (err) {
              return reject(err);
            }
            const filename = buf.toString('hex') + path.extname(file.originalname);
            const fileInfo = {
              filename: filename,
              bucketName: 'uploads'
            };
            resolve(fileInfo);
          });
        });
      }
    }
});
const upload = multer({ storage });


// @ROUTE POST /IMAGE
// @DESC CREATE - UPLOADS IMAGE CHUNKS TO DATABASE
router.post('/', AuthChk, upload.single('file'), (req, res) => {
  res.redirect('/');
});

// @ROUTE GET /IMAGE/:FILENAME
// @DESC READ - DISPLAYS IMAGE
router.get('/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // CHECKS IF IS FILE
      if (!file || file.length === 0) {
        return res.status(404).json({ err: 'No file exists'});
      }
      // CHECKS IF IS AN IMAGE OF TYPE JPEG/PNG
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // READ OUTPUT TO BROWSER
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  });
  
// @ROUTE /IMAGE/:ID
// @DESC DESTROY - REMOVES FILE FROM DATABASE
router.delete('/:id', AuthChk, (req, res) => {
    gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, GridStore) => {
      if (err) {
          return res.status(404).json({ err: err });
      }
      res.redirect('/');
    });
});

module.exports = router;