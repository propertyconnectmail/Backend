const MongooseService = require( './MongooseService' ); // Data Access Layer
const FileModel = require( "../models/Professional" ); // Database Model
const { registerProfessionalValidation , ratingValidation , bankAccountValidation } = require("../validation/professional.validation");
const aws = require('../middlewares/awsMiddleware');  
const fs = require('fs');
const bcrypt = require('bcryptjs');
const path = require('path'); 


class FileService {
  /**
   * @description Create an instance of PostService
   */
  constructor () {
    // Create instance of Data Access layer using our desired model
    this.MongooseServiceInstance = new MongooseService( FileModel.Professional );
  }

  
  /**
   * @description Attempt to create a post with the provided object
   */
  async create ( body) {
    try {
        //Validating with joi schema by calling validateRegistration function at the end of the page
        if(body != null){
            let { error } = await registerProfessionalValidation(body);
            if (error) return {Status: "400" , Error: error.details[0].message, Type:"Joi" }
        }

        //Check if email already exists
        let emailExist = await this.findEmailExist(body.email);
        if(emailExist) return  {Status: "400" , Email : emailExist.email, Error: "Email Already Exists!", Type: "Joi" }

        //Hashing the Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.password, salt)
        body.password = hashedPassword;


        //Multiple file upload
        const uploadedUrls = [];

        for (const url of body.certifications) {
            const fileName = url.split('/static/Temp/')[1];  // 'Sample-File---1-1746271360260.pdf'
            const localFilePath = path.resolve(__dirname, '../../Public/Temp', fileName);

            try{
                const aws_url = await aws.uploadfile(localFilePath); // Upload file from disk
                uploadedUrls.push(aws_url.Location); // Push the AWS URL

                // Delete the local temp file
                fs.unlink(localFilePath, (err) => {
                    if (err) console.error(`Failed to delete ${fileName}:`, err);
                    else console.log(`Deleted temp file: ${fileName}`);
                });
            }catch(err){
                console.error(`Upload failed for ${fileName}:`, err);
                // Optional: handle failure (e.g., abort, continue, notify)
            }
        }

        // Replace the original array with uploaded URLs
        body.certifications = uploadedUrls;
        
        // Creating the User
        let result = await this.MongooseServiceInstance.create(body)
        if(result.email === body.email){
            return { message : "success" }
        }

        return result;
    } 
    catch ( err ) {
      console.log( err)
      return { Status: 500 , Error : `${err.name} : ${err.message} `, Location: "./Src/Services/employee.service.js - create(body)"};
    }
  }


  


  /**
   * @description Attempt to find a post with the provided email
   * @returns {Object}
   */
  async findOne( body ) {
    try {
      let result = await this.MongooseServiceInstance.findOne({ email: body.email })
      if(result.email != null || result.email != ""){
        return result;
      }
      return result
    } 
    catch ( err ) {
        console.log( err)
        return { Status: 500 , Error : `${err.name} : ${err.message} `, Location: "./Src/Services/employee.service.js - findOne(body)"};
    }
  }


   /**
   * @description Attempt to find a post with the provided email
   * @returns {Object}]
   */
   async find(  ) {
    try {
      let result = await this.MongooseServiceInstance.find()
      if(result.length != null || result.length != 0){
        return result;
      }
      return result
    } 
    catch ( err ) {
        console.log( err)
        return { Status: 500 , Error : `${err.name} : ${err.message} `, Location: "./Src/Services/employee.service.js - findOne(body)"};
    }
  }




  /**
   * @description Attempt to find a post with the provided email
   * @returns {Object}]
   */
  async findVerified(  ) {
    try {
      let result = await this.MongooseServiceInstance.find({status : 'verified'})
      if(result.length != null || result.length != 0){
        return result;
      }
      return result
    } 
    catch ( err ) {
        console.log( err)
        return { Status: 500 , Error : `${err.name} : ${err.message} `, Location: "./Src/Services/employee.service.js - findOne(body)"};
    }
  }



    /**
   * @description Attempt to update a post with the provided object
   */
    async updateOne( body ) {
        try {

          console.log(body);
            //Validating with joi schema
            if(body != null){
                let { error } = await registerProfessionalValidation(body);
                if (error) return {Status: "400" , Error: error.details[0].message , Type:"Joi" }
            }

            let professionalExist = await this.findEmailExist(body.email);

            if(professionalExist.email === body.email && professionalExist.certifications[0] === body.certifications[0]){
              //Updating document and returning result
              let result = await this.MongooseServiceInstance.updateOne({ email: body.email }, body);
              
              if(result.modifiedCount === 1){
                return { message : "success" }
              }
              return result;
            }


            if(professionalExist.email === body.email && professionalExist.certifications[0] != body.certifications[0]){

              for (const url of professionalExist.certifications) {
                try{
                    await aws.deletefile(url); // delete file from disk
                }catch(err){
                    console.error(`Upload failed for ${fileName}:`, err);
                }
              }

              //Multiple file upload
              const uploadedUrls = [];

              for (const url of body.certifications) {
                  const fileName = url.split('/static/Temp/')[1];  // 'Sample-File---1-1746271360260.pdf'
                  const localFilePath = path.resolve(__dirname, '../../Public/Temp', fileName);

                  try{
                      const aws_url = await aws.uploadfile(localFilePath); // Upload file from disk
                      uploadedUrls.push(aws_url.Location); // Push the AWS URL

                      // Delete the local temp file
                      fs.unlink(localFilePath, (err) => {
                          if (err) console.error(`Failed to delete ${fileName}:`, err);
                          else console.log(`Deleted temp file: ${fileName}`);
                      });
                  }catch(err){
                      console.error(`Upload failed for ${fileName}:`, err);
                      // Optional: handle failure (e.g., abort, continue, notify)
                  }
              }

              body.certifications = uploadedUrls;
              console.log(body.certifications)

              //Updating document and returning result
              let result = await this.MongooseServiceInstance.updateOne({ email: body.email }, body);
              if(result.modifiedCount === 1){
                return { message : "success" }
              }
              return result;
            }

              return { message : "false" }
        } 
        catch ( err ) {
            console.log( err)
            return { Status: 500, Error : `${err.name} : ${err.message} `, Location: "./Src/Services/employee.service.js - updateOne(body)" };
        }
    }




  /**
   * @description Attempt to update a post with the provided object
   */
      async updateProfessionalPicture( body ) {
        try { 

            let imageExist = await this.findOne({ email: body.email });

            if(body.url != 'https://property-connect-bucket.s3.eu-north-1.amazonaws.com/profile-image.svg'){
              await aws.deletefile(imageExist.url);
            }
    
            const fileName = body.url.split('/static/Temp/')[1];  // 'Sample-File---1-1746271360260.pdf'
            const localFilePath = path.resolve(__dirname, '../../Public/Temp', fileName);

            let aws_url;
            
            try{
                aws_url = await aws.uploadfile(localFilePath);

                // Delete the local temp file
                fs.unlink(localFilePath, (err) => {
                    if (err) console.error(`Failed to delete ${fileName}:`, err);
                    else console.log(`Deleted temp file: ${fileName}`);
                });
            }catch(err){
                console.error(`Upload failed for ${fileName}:`, err);
                // Optional: handle failure (e.g., abort, continue, notify)
            }    
    
            imageExist.url = aws_url.Location;
            
            let process =  await this.MongooseServiceInstance.updateOne({ email: body.email }, imageExist);

            return { message : "success", url : imageExist.url};
        } 
        catch ( err ) {
            console.log( err)
            return { Status: 500, Error : `${err.name} : ${err.message} `, Location: "./Src/Services/employee.service.js - updatePic(body)" };
        }
    }



         /**
   * @description Attempt to update a post with the provided object
   * @param body {object} Object containing 'email' field and the updated body
   * to update specific post
   * @returns {Object}
   */
    async updateProfessionalPassword( body ) {
        try {

            let user = await this.MongooseServiceInstance.findOne({email : body.email})
            if(!user){ return null }

            const validPassword = await bcrypt.compare(body.oldPassword, user.password)
            if (!validPassword) return { Status: 400, Error: "Please Enter the Valid Old Password" }

            //Hashing the Password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(body.newPassword, salt)

            //Updating document and returning result
            let result = await this.MongooseServiceInstance.updateOne({email : body.email},{password : hashedPassword});
            if(result.modifiedCount === 1){
              return { message : "success" }
            }
            return result;
        } 
        catch ( err ) {
            console.log( err)
            return { Status: 500, Error : `${err.name} : ${err.message} `, Location: "./Src/Services/employee.service.js - updatePassword(body)" };
        }
    }




      /**
   * @description Attempt to delete a post with the provided object
   */
  async deleteOne( body ) {
    try {

        console.log(body)

        if(body.url != 'https://property-connect-bucket.s3.eu-north-1.amazonaws.com/profile-image.svg'){
          await aws.deletefile(body.url);
        }

        //Multiple file delete
        for (const url of body.certifications) {
            
            try{
                await aws.deletefile(url); // Upload file from disk
            }catch(err){
                console.error(`Upload failed for ${fileName}:`, err);
            }
        }

      let result = await this.MongooseServiceInstance.deleteOne({ email: body.email });
      if(result.deletedCount === 1){
        return { message : "success" }
      }
      return result;
    } 
    catch ( err ) {
      console.log( err)
      return { Status: 500 , Error : `${err.name} : ${err.message} `, Location: "./Src/Service/employee.service.js - deleteOne(body)"};
    }
  }



    /**
   * @description Attempt to find if provided email exists in database
   */
    async findEmailExist( email ) {
        try {
            return await this.MongooseServiceInstance.findOne({email : email});
        } 
        catch ( err ) {
            console.log( err)
            return { Status: 500 , Error : `${err.name} : ${err.message} `, Location: "./Src/Services/employee.service.js - findEmailExist(email)"};
        }
    }
}

module.exports = FileService;