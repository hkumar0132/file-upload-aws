require('dotenv/config')
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid')

const app = express();
const port = process.env.PORT || 5000;

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET
});

const storage = multer.memoryStorage({
  destination: function(req, file, callback) {
    callback(null, '')
  }
});

const upload = multer({ storage }).single('image');

app.post('/upload', upload, (req, res) => {
  console.log(req.file);

  const my_image = req.file.originalname.split("."); 
  const file_type = my_image[my_image.length - 1];

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${uuidv4()}.${file_type}`,
    Body: req.file.buffer
  }

  s3.upload(params, (error, data) => {
    if(error) {
      res.send(500).send(error);
    }

    res.status(200).send(data);
  });

});

app.listen(port, () => console.log(`Server is listening on ${port}`) );
