const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
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
  const uploadDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  return res.json({ hash: req.file.filename });
});

app.listen(3000, () => {
  console.log(`Server is running`);
});