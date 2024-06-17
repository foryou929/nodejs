const express = require('express');
const formidable = require('formidable');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());

app.post('/api/upload', async (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), 'public');
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: 'Error uploading file' });
    }

    return res.status(200).json({ url: files.file[0].newFilename });
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});