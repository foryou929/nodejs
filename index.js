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
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const hash = crypto.randomBytes(16).toString('hex');
    const fileExtension = path.extname(file.originalname);
    cb(null, `${hash}${fileExtension}`);
  },
});

const upload = multer({ storage });

app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  return res.json({ hash: req.file.filename });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});