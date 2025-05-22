const MongooseService = require( './MongooseService' ); // Data Access Layer
const FileModel = require( "../models/Client" ); // Database Model
const { registerClientValidation } = require("../validation/client.validation");
const aws = require('../middlewares/awsMiddleware');  
const fs = require('fs');
const bcrypt = require('bcryptjs');
const path = require('path'); 


class FileService {
  /**
   * @description Create an instance of PostService
   */
  constructor() {
    // Create instance of Data Access layer using our desired model
    this.MongooseServiceInstance = new MongooseService(FileModel.Client);
  }


  /**
   * @description Attempt to create a post with the provided object
   * @param body {object} Object containing all required fields to
   * create post
   * @returns {Object}
   */
  async create(body) {
    try {
      //Validating with joi schema by calling validateRegistration function at the end of the page
      if (body != null) {
        let { error } = await registerClientValidation(body);
        if (error) return { Status: "400", Error: error.details[0].message, Type: "Joi" }
        
      }

      //Check if email already exists
      let emailExist = await this.findEmailExist(body.email);
      if (emailExist) return { Status: "400", Email: emailExist.email, Error: "Email Already Exists!" }

      //Hashing the Password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(body.password, salt)
      body.password = hashedPassword;

      //Creating the User
      let result = await this.MongooseServiceInstance.create(body)
      if(result.email === body.email){
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
     async findOne( body ) {
      try {
        let result = await this.MongooseServiceInstance.findOne({ email: body.email })
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
                  let { error } = await registerClientValidation(body);
                  if (error) return {Status: "400" , Error: error.details[0].message, Type: "Joi" }
              }
  
  
             //Updating document and returning result
              let result = await this.MongooseServiceInstance.updateOne({ email: body.email }, body);
              if(result.modifiedCount === 1){
                return { message : "success" }
              }
              return result;
          } 
          catch ( err ) {
              console.log( err)
              return { Status: 500, Error : `${err.name} : ${err.message} `, Location: "./Src/Services/employee.service.js - updateOne(body)" };
          }
      }



    /**
   * @description Attempt to update a post with the provided object
   */
      async updateClientPicture( body ) {
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
    async updatePassword( body ) {
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
              
          try{
            if(body.url != 'https://property-connect-bucket.s3.eu-north-1.amazonaws.com/profile-image.svg'){
              await aws.deletefile(body.url);
            }
          }catch(err){
              console.error(`Upload failed for ${fileName}:`, err);
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
   * @description Attempt to update a post with the provided object
   */
     async addCard( body ) {
      try {

          let user = await this.MongooseServiceInstance.findOne({email : body.email})
          if(!user){ return null }

          // Initialize cards array if not present
          if (!Array.isArray(user.cards)) {
            user.cards = [];
          }

          // Push new card details into the array
          user.cards.push({
            cardNumber: body.cardNumber,
            expiryMonth: body.expiryMonth,
            expiryYear: body.expiryYear,
            cardHolderName: body.cardHolderName,
            cvv: body.cvv
          });

          let result = await this.MongooseServiceInstance.updateOne({email : body.email},{cards : user.cards});
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
   * @description Attempt to update a post with the provided object
   */
   async getCards( body ) {
    try {
        let user = await this.MongooseServiceInstance.findOne({email : body.email})
        if (!user || !user.cards) {
          return []; // or return a message like { message: "No cards found" }
        }

        // Extract only card numbers
        let cardNumbers = user.cards.map(card => card.cardNumber);
        return cardNumbers;
    } 
    catch ( err ) {
        console.log( err)
        return { Status: 500, Error : `${err.name} : ${err.message} `, Location: "./Src/Services/employee.service.js - updatePassword(body)" };
    }
  }



   /**
   * @description Attempt to update a post with the provided object
   */
   async getCard( body ) {
    try {

      let user = await this.MongooseServiceInstance.findOne({ email: body.email });

      if (!user || !user.cards || user.cards.length === 0) {
        return null; // or return { message: "No cards found" }
      }
      
      // Loop through the cards to find the matching one
      for (let card of user.cards) {
        if (card.cardNumber === body.cardNumber) {
          return card; // Return the matched card's full details
        }
      }
      
      // If no match is found
      return null; 
    } 
    catch ( err ) {
        console.log( err)
        return { Status: 500, Error : `${err.name} : ${err.message} `, Location: "./Src/Services/employee.service.js - updatePassword(body)" };
    }
  }




  /**
   * @description Attempt to update a post with the provided object
   */
  async updateCard( body ) {
    try {

      let result = await this.MongooseServiceInstance.updateOne({email: body.email,"cards.cardNumber": body.cardNumber},
        {
          $set: {
            "cards.$.cardHolderName": body.cardHolderName,
            "cards.$.expiryMonth": body.expiryMonth,
            "cards.$.expiryYear": body.expiryYear,
            "cards.$.cvv": body.cvv
          }
        }
      );

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
   * @description Attempt to update a post with the provided object
   */
  async deleteCard( body ) {
    try { 
      const result = await this.MongooseServiceInstance.updateOne(
        { email: body.email },
        {
          $pull: {
            cards: { cardNumber: body.cardNumber }
          }
        }
      );
    
      if (result.modifiedCount === 1) {
        return { message: 'success' };
      }
      return result;
    } 
    catch ( err ) {
        console.log( err)
        return { Status: 500, Error : `${err.name} : ${err.message} `, Location: "./Src/Services/employee.service.js - updatePassword(body)" };
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