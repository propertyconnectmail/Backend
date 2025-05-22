// const axios = require('axios');
// const archiver = require('archiver');

// async function downloadCertificationsAsZip(urls, res) {
  
//   let urls = req.query.urls;

//   // Normalize single vs multiple URL cases
//   if (!urls) {
//     return res.status(400).json({ message: 'Missing urls parameter' });
//   }

//   if (typeof urls === 'string') {
//     urls = [urls]; // Convert single URL string to array
//   }

//   if (!Array.isArray(urls)) {
//     return res.status(400).json({ message: 'Invalid urls format' });
//   }

//   res.attachment('certifications.zip');
//   const archive = require('archiver')('zip');
//   archive.pipe(res);

//   const axios = require('axios');

//   for (let fileUrl of urls) {
//     try {
//       const response = await axios.get(fileUrl, { responseType: 'stream' });
//       const filename = decodeURIComponent(fileUrl.split('/').pop());
//       archive.append(response.data, { name: filename });
//     } catch (err) {
//       console.error(`Failed to download: ${fileUrl}`, err.message);
//     }
//   }

//   await archive.finalize();
// }

// module.exports = { downloadCertificationsAsZip };
