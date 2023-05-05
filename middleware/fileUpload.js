const multer = require('multer');

const storage = multer.diskStorage({
  destination : (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename : (req, file, cb) => {
    try {
      const name = JSON.parse(req.body.text).name;
      const newName = `${name}-${file.originalname}`; // Generate a unique filename using the current timestamp
      cb(null, newName);
    } catch (error) {
      cb(error);
    }
  }
});

const fileFilter = (req, file, cb)=>{
  if(file.mimetype === 'image/png' || file.mimetype === "image/jpeg" || file.mimetype === "image/jpg"){
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter }).array('filefield', 5); // Set the field name to 'filefield' and the maximum number of files to 10 (you can adjust this as needed)


module.exports = { upload };
