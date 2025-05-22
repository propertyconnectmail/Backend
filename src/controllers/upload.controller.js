const config = require( '../config/config')

module.exports = { createUpload , createCertificationUpload, createDocumentAndImageUpload, updateUpload};


/**
 * @description Create upload image url
 */
async function createUpload(req, res) {
    try {
      // Check if file is uploaded
      if (!req.file) {
        return res.status(400).send({ Status: 400, Success: false, Error: 'No file uploaded' });
      }
  
      // Construct the public URL
      const fileUrl = `${req.protocol}://${req.get('host')}/static/Temp/${req.file.filename}`;
  
      // Return success response with URL
      return res.status(200).send({
        Status: 200,
        Success: true,
        message: 'File uploaded successfully',
        fileUrl: fileUrl
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        Status: 500,
        Success: false,
        Error: `${err.name}: ${err.message}`
      });
    }
  }


  /**
 * @description Create upload certification files url
 */
async function createCertificationUpload(req, res) {
    try {
      // Check if files are uploaded
      if (!req.files || req.files.length === 0) {
        return res.status(400).send({ Status: 400, Success: false, Error: 'No certification files uploaded' });
      }
  
      // Initialize an array to hold file URLs
      const fileUrls = req.files.map(file => {
        return `${req.protocol}://${req.get('host')}/static/Temp/${file.filename}`;
      });
  
      // Return success response with file URLs
      return res.status(200).send({
        Status: 200,
        Success: true,
        message: 'Certification files uploaded successfully',
        fileUrls: fileUrls
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        Status: 500,
        Success: false,
        Error: `${err.name}: ${err.message}`
      });
    }
}

  
  
/**
 * @description Create upload document and image files url
 */
async function createDocumentAndImageUpload(req, res) {
    try {
      // Check if files are uploaded
      if (!req.files || req.files.length === 0) {
        return res.status(400).send({ Status: 400, Success: false, Error: 'No files uploaded' });
      }
  
      // Initialize an array to hold file URLs
      const fileUrls = req.files.map(file => {
        return `${req.protocol}://${req.get('host')}/static/Temp/${file.filename}`;
      });
  
      // Return success response with file URLs
      return res.status(200).send({
        Status: 200,
        Success: true,
        message: 'Files uploaded successfully',
        fileUrls: fileUrls
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        Status: 500,
        Success: false,
        Error: `${err.name}: ${err.message}`
      });
    }
  }
  

/**
 * @description Create upload files url
 * @param req {object} Express req object 
 * @param res {object} Express res object
 * @returns {object} success or failure object
 */
async function updateUpload ( req, res ) {
    try {
      let url = config.url+'/Files/'+req.file.filename;
      return res.send( {"result": url} );
    } catch ( err ) {
      console.log( err ); 
      res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
    }
  }