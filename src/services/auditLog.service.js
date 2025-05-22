const MongooseService = require( './MongooseService' ); // Data Access Layer
const FileModel = require( "../models/AuditLog" ); // Database Model
const { auditLogValidation } = require("../validation/auditLog.validation");
const aws = require('../middlewares/awsMiddleware');  
const fs = require('fs');
const bcrypt = require('bcryptjs');


class FileService {
  /**
   * @description Create an instance of PostService
   */
  constructor () {
    // Create instance of Data Access layer using our desired model
    this.MongooseServiceInstance = new MongooseService( FileModel.AuditLog );
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

      body.id = code;

      //Validating with joi schema by calling validateRegistration function at the end of the page
      if (body != null) {
        let { error } = await auditLogValidation(body);
        if (error) return { Status: "400", Error: error.details[0].message }
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
      return { Status: 500, Error: `${err.name} : ${err.message} `, Location: "./Src/Services/customer.service.js - create(body)" };
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
   * @description Attempt to find if provided email exists in database
   */
    async createId() {
        try {

            let codeExist;
            let code;

            do {
            const randomFourDigit = Math.floor(1000 + Math.random() * 9000);
            code = 'LOG-' + randomFourDigit;
            codeExist = await this.MongooseServiceInstance.findOne({ id: code });
            } while (codeExist);

            return code;
        } 
        catch ( err ) {
            console.log( err)
            return { Status: 500 , Error : `${err.name} : ${err.message} `, Location: "./Src/Services/employee.service.js - findEmailExist(email)"};
        }
    }
}

module.exports = FileService;