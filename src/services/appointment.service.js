const MongooseService = require( './MongooseService' ); // Data Access Layer
const FileModel = require( "../models/Appointment" );
const { createMeeting } = require('../utils/zoom');
const aws = require('../middlewares/awsMiddleware');  
const fs = require('fs');
const path = require('path');


class FileService {
  /**
   * @description Create an instance of PostService
   */
  constructor () {
    // Create instance of Data Access layer using our desired model
    this.MongooseServiceInstance = new MongooseService( FileModel.Appointment );
  }

  
  /**
   * @description Attempt to create a post with the provided object
   * @param body {object} Object containing all required fields to
   * create post
   * @returns {Object}
   */
  async create(body) {
    try {
        // Generate unique appointment ID

        console.log(body)
        const code = await this.createId();
        body.appointmentId = code;

        // Create Zoom meeting
        const meeting = await createMeeting({
            topic: `Appointment - ${body.clientEmail}`,
            date: body.appointmentDate,
            time: body.appointmentTime,
        });

        // Add Zoom links to the appointment
        body.zoomJoinLink = meeting.join_url;
        body.zoomStartLink = meeting.start_url;

        // Create the appointment in DB
        const result = await this.MongooseServiceInstance.create(body);

        // Simple confirmation check
        if (result && result.appointmentId === code) {
            return { message: "success" };
        }

        return { message: "failed" };
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
   async find() {
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
   async findClientAppointments(body) {
    try {
      let result = await this.MongooseServiceInstance.find({clientEmail : body.clientEmail})
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
   async findProfessionalAppointments(body) {
    try {
      let result = await this.MongooseServiceInstance.find({professionalEmail : body.professionalEmail})
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
   async getAppointment(body) {
    try {
      let result = await this.MongooseServiceInstance.findOne({appointmentId : body.appointmentId})
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

            //Updating document and returning result
            let result = await this.MongooseServiceInstance.updateOne({ appointmentId: body.appointmentId }, body);
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
     async updateClientFiles( body ) {
      try {

          let appointment = await this.MongooseServiceInstance.findOne({appointmentId : body.appointmentId});

          if(appointment.appointmentId === body.appointmentId && appointment.clientDocuments.length > 0){

            console.log("in already have")
          
            for (const url of appointment.clientDocuments) {
              try{
                  await aws.deletefile(url); // delete file from disk
              }catch(err){
                  console.error(`Upload failed for ${fileName}:`, err);
              }
            }

            //Multiple file upload
            const uploadedUrls = [];

            for (const url of body.clientDocuments) {
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

            appointment.clientDocuments = uploadedUrls;
            appointment.clientDocumentsUploaded = body.clientDocumentsUploaded;

            //Updating document and returning result
            let result = await this.MongooseServiceInstance.updateOne({ appointmentId : appointment.appointmentId }, appointment);
            if(result.modifiedCount === 1){
              return { message : "success" }
            }
            return result;
        }

        
        if(appointment.appointmentId === body.appointmentId && appointment.clientDocuments.length === 0){
          console.log("in no documents")

          //Multiple file upload
          const uploadedUrls = [];

          for (const url of body.clientDocuments) {
              const fileName = url.split('/static/Temp/')[1];  // 'Sample-File---1-1746271360260.pdf'
              console.log(fileName)
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

          appointment.clientDocuments = uploadedUrls;
          appointment.clientDocumentsUploaded = body.clientDocumentsUploaded;

          //Updating document and returning result
          let result = await this.MongooseServiceInstance.updateOne({ appointmentId : appointment.appointmentId }, appointment);
          if(result.modifiedCount === 1){
            return { message : "success" }
          }
          return result;
        }
      } 
      catch ( err ) {
          console.log( err)
          return { Status: 500, Error : `${err.name} : ${err.message} `, Location: "./Src/Services/employee.service.js - updateOne(body)" };
      }
    }






     /**
     * @description Attempt to update a post with the provided object
     */
     async updateProfessionalFiles( body ) {
      try {

          let appointment = await this.MongooseServiceInstance.findOne({appointmentId : body.appointmentId});

          if(appointment.appointmentId === body.appointmentId && appointment.professionalDocuments.length > 0){

            console.log("in update professional files")
          
            for (const url of appointment.professionalDocuments) {
              try{
                  await aws.deletefile(url); // delete file from disk
              }catch(err){
                  console.error(`Upload failed for ${fileName}:`, err);
              }
            }

            //Multiple file upload
            const uploadedUrls = [];

            for (const url of body.professionalDocuments) {
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

            appointment.professionalDocuments = uploadedUrls;
            appointment.professionalDocumentsUploaded = body.professionalDocumentsUploaded;

            //Updating document and returning result
            let result = await this.MongooseServiceInstance.updateOne({ appointmentId : appointment.appointmentId }, appointment);
            if(result.modifiedCount === 1){
              return { message : "success" }
            }
            return result;
        }

        
        if(appointment.appointmentId === body.appointmentId && appointment.professionalDocuments.length === 0){
          console.log("in no documents")

          //Multiple file upload
          const uploadedUrls = [];

          for (const url of body.professionalDocuments) {
              const fileName = url.split('/static/Temp/')[1];  // 'Sample-File---1-1746271360260.pdf'
              console.log(fileName)
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

          appointment.professionalDocuments = uploadedUrls;
          appointment.professionalDocumentsUploaded = body.professionalDocumentsUploaded;

          //Updating document and returning result
          let result = await this.MongooseServiceInstance.updateOne({ appointmentId : appointment.appointmentId }, appointment);
          if(result.modifiedCount === 1){
            return { message : "success" }
          }
          return result;
        }
      } 
      catch ( err ) {
          console.log( err)
          return { Status: 500, Error : `${err.name} : ${err.message} `, Location: "./Src/Services/employee.service.js - updateOne(body)" };
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
                const randomSixDigit = Math.floor(100000 + Math.random() * 900000); // 100000 to 999999
                code = 'A-' + randomSixDigit;
                codeExist = await this.MongooseServiceInstance.findOne({ appointmentId: code });
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