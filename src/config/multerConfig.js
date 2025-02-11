const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const menuItemId = req.body.id || uuidv4();
    const uploadPath = path.join(__dirname, '../uploads', menuItemId, 'images');

    fs.mkdirSync(uploadPath, { recursive: true });
    req.menuItemId = menuItemId; 
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage , limits: { fileSize: 10 * 1024 * 1024 }}).array('images', 5);

module.exports = {upload} 
