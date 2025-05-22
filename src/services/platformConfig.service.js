const MongooseService = require( './MongooseService' ); // Data Access Layer
const FileModel = require( "../models/PlatformConfig" ); // Database Model
const aws = require('../middlewares/awsMiddleware');  
const fs = require('fs');
const bcrypt = require('bcryptjs');


class FileService {
  /**
   * @description Create an instance of PostService
   */
  constructor () {
    // Create instance of Data Access layer using our desired model
    this.MongooseServiceInstance = new MongooseService( FileModel.PlatformConfig );
  }

  
  /**
   * @description Attempt to create a post with the provided object
   * @param body {object} Object containing all required fields to
   * create post
   * @returns {Object}
   */
  async create(body) {
    try {
      
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
   async findPlatformConfig(body) {
    try {
        let result = await this.MongooseServiceInstance.findOne({ id : body.id })
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
        async updateTotalProfessionals() {
            try {
                let platformConfigExist = await this.MongooseServiceInstance.findOne({id : "1"});

                let count = 1 + parseInt(platformConfigExist.totalProfessionals)
                platformConfigExist.totalProfessionals = count.toString();

                //Updating document and returning result
                let result = await this.MongooseServiceInstance.updateOne({ id: "1" }, platformConfigExist);
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
         async updateTotalClients() {
          try {
              let platformConfigExist = await this.MongooseServiceInstance.findOne({id : "1"});

              let count = 1 + parseInt(platformConfigExist.totalClients)
              platformConfigExist.totalClients = count.toString();

              //Updating document and returning result
              let result = await this.MongooseServiceInstance.updateOne({ id: "1" }, platformConfigExist);
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
        async updateTotalRevenue( body ) {
          try {
              let platformConfig = await this.MongooseServiceInstance.findOne({ id : '1' })

              const currentRevenue = parseFloat(platformConfig.totalRevenue);
              const newCommission = parseFloat(body.commission);
              const updatedRevenue = (currentRevenue + newCommission).toFixed(2);

              platformConfig.totalRevenue = updatedRevenue;

              //Updating document and returning result
              let result = await this.MongooseServiceInstance.updateOne({ id: "1" }, platformConfig);
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
      async updateTotalAppointments() {
        try {

            let platformConfigExist = await this.MongooseServiceInstance.findOne({id : "1"});

            let count = 1 + parseInt(platformConfigExist.totalAppointments)
            platformConfigExist.totalAppointments = count.toString();

            //Updating document and returning result
            let result = await this.MongooseServiceInstance.updateOne({ id: "1" }, platformConfigExist );
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
    async updateMaintainanceMode(body) {
      try {

          let platformConfigExist = await this.MongooseServiceInstance.findOne({ id: body.id });

          if (!platformConfigExist) {
            return { message: 'Platform config not found' };
          }

          if (body.maintenanceMode === 'on' || body.maintenanceMode === 'off') {
            platformConfigExist.maintenanceMode = body.maintenanceMode;

            const result = await this.MongooseServiceInstance.updateOne(
              { id: body.id },
              platformConfigExist
            );

            if (result.modifiedCount === 1) {
              return { message: 'success' };
            }

            return result;
          }

          return { message: 'Invalid maintenance mode value' };

      } 
      catch ( err ) {
          console.log( err)
          return { Status: 500, Error : `${err.name} : ${err.message} `, Location: "./Src/Services/platformConfig.service.js - updateMaintainance(body)" };
      }
  }
  
}

module.exports = FileService;