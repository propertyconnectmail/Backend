const MongooseService = require( './MongooseService' ); // Data Access Layer
const FileModel = require( "../models/RegistryLocation" ); // Database Model
const { registerRegistryLocationValidation } = require("../validation/registryLocation.validation");
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
    this.MongooseServiceInstance = new MongooseService( FileModel.RegistryLocation );
  }

  
  /**
   * @description Attempt to create a post with the provided object
   * @param body {object} Object containing all required fields to
   * create post
   * @returns {Object}
   */
  async create(body) {
    try {

      //Check if email already exists
      let code = await this.createId();
      console.log(body)
      body.id = code;

      //Validating with joi schema by calling validateRegistration function at the end of the page
      if (body != null) {
        let { error } = await registerRegistryLocationValidation(body);
        if (error) return { Status: "400", Error: error.details[0].message, Type: "Joi" }
      }

        if(body.url != 'https://example.com/images/registryLocation.jpg'){
          console.log(body.url)
            const fileName = body.url.split('/static/Temp/')[1];  // 'Sample-File---1-1746271360260.pdf'
            const localFilePath = path.resolve(__dirname, '../../Public/Temp', fileName);
            let aws_url;
            console.log(localFilePath)

            try{
                aws_url = await aws.uploadfile(localFilePath); // Upload file from disk

                // Delete the local temp file
                fs.unlink(localFilePath, (err) => {
                    if (err) console.error(`Failed to delete ${fileName}:`, err);
                    else console.log(`Deleted temp file: ${fileName}`);
                });
            }catch(err){
                console.error(`Upload failed for ${fileName}:`, err);
            }

            body.url = aws_url.Location;

            //Creating the User
            let result = await this.MongooseServiceInstance.create(body)
            if(result.id === body.id){
              return { message : "success" }
            }

            return result;
        }
      
      //Creating the User
      let result = await this.MongooseServiceInstance.create(body)
      if(result.id === body.id){
        return { message : "success" }
      }

      return result;
    }
    catch (err) {
      console.log(err)
      return { Status: 500, Error: `${err.name} : ${err.message} `, Location: "./Src/Services/registryLocation.service.js - create(body)" };
    }
  }


   /**
     * @description Attempt to find a post with the provided email
     * @returns {Object}]
     */
     async findOne( body ) {
      try {
        console.log(body)
        let result = await this.MongooseServiceInstance.findOne({ locationName: body.locationName })
        console.log(result)
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
    async create( body ) {
      return await this.MongooseServiceInstance.create(body);
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
     * @description Attempt to update a post with the provided object
     */
    async updateOne( body ) {
        try {    
            //Validating with joi schema
            if(body != null){
                let { error } = await registerRegistryLocationValidation(body);
                if (error) return {Status: "400" , Error: error.details[0].message, Type: "Joi" }
            }


            let registryLocationExist = await this.findIdExist(body.id);


            if(registryLocationExist.id === body.id && registryLocationExist.url === body.url){
              //Updating document and returning result
              let result = await this.MongooseServiceInstance.updateOne({ id: body.id }, body);
              if(result.modifiedCount === 1){
                return { message : "success" }
              }
              return result;
            }


            if(registryLocationExist.id === body.id && registryLocationExist.url != body.url){

                const fileName = body.url.split('/static/Temp/')[1];  // 'Sample-File---1-1746271360260.pdf'
                const localFilePath = path.resolve(__dirname, '../../Public/Temp', fileName);
                let aws_url;                

                await aws.deletefile(registryLocationExist.url); // delete file from disk

                try{
                    aws_url = await aws.uploadfile(localFilePath); // Upload file from disk
        
                    // Delete the local temp file
                    fs.unlink(localFilePath, (err) => {
                        if (err) console.error(`Failed to delete ${fileName}:`, err);
                        else console.log(`Deleted temp file: ${fileName}`);
                    });
                }catch(err){
                    console.error(`Upload failed for ${fileName}:`, err);
                }

                body.url = aws_url.Location;

                //Updating document and returning result
                let result = await this.MongooseServiceInstance.updateOne({ id: body.id }, body);
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
     * @description Attempt to delete a post with the provided object
     */
    async deleteOne( body ) {
      try {
          try{
            if(body.url != 'https://example.com/images/registryLocation.jpg'){
              await aws.deletefile(body.url);
            }
          }catch(err){
              console.error(`Upload failed for ${fileName}:`, err);
          }

        let result = await this.MongooseServiceInstance.deleteOne({ id: body.id });
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
}

module.exports = FileService;