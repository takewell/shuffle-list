const format = require('util').format;
const Storage = require('@google-cloud/storage');
const config = require('../config');
const storage = new Storage({ keyFilename: config.KEYFILENAMEPATH });
const bucket = storage.bucket(process.env.BUCKET_NAME || config.BUCKET_NAME);

/** 
 * @return {pictureSrc}
 */

module.exports = storeBlob = (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream();
    let pictureSrc = null;

    blobStream.on('error', (err) => {
      return reject(err);
    });

    blobStream.on('finish', () => {
      pictureSrc = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
      return resolve(pictureSrc);
    });

    blobStream.end(fileBuffer);
  });
};