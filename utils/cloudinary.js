const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: 'dwelcatn8',
  api_key: '693586958125638',
  api_secret: '1D2lz6kYodqF-DaXQZP3JhYGlqg',
});

module.exports = cloudinary;
