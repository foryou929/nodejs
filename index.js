const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'image/');
  },
  filename: (req, file, cb) => {
    const hash = crypto.randomBytes(16).toString('hex');
    const fileExtension = path.extname(file.originalname);
    cb(null, `${hash}${fileExtension}`);
  },
});

const upload = multer({ storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  return res.json({ hash: req.file.filename });
});

app.listen(3000, () => {
  console.log(`Server is running`);
});