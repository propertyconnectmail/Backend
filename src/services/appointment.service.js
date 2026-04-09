const MongooseService = require('./MongooseService'); // Data Access Layer
const FileModel = require("../models/Appointment");
const { createMeeting } = require('../utils/zoom');
const aws = require('../middlewares/awsMiddleware');  
const fs = require('fs');
const path = require('path');

class FileService {
  constructor() {
    this.MongooseServiceInstance = new MongooseService(FileModel.Appointment);
  }
  
  async create(body) {
    try {
      console.log(body)
      const code = await this.createId();
      body.appointmentId = code;
      const meeting = await createMeeting({
        topic: `Appointment - ${body.clientEmail}`,
        date: body.appointmentDate,
        time: body.appointmentTime,
      });
      body.zoomJoinLink = meeting.join_url;
      body.zoomStartLink = meeting.start_url;
      const result = await this.MongooseServiceInstance.create(body);
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

  async find() {
    try {
      let result = await this.MongooseServiceInstance.find()
      if (result.length != null || result.length != 0) {
        return result;
      }
      return result
    } 
    catch (err) {
      console.log(err)
      return { Status: 500, Error: `${err.name} : ${err.message} `, Location: "./Src/Services/employee.service.js - findOne(body)" };
    }
  }

  async findClientAppointments(body) {
    try {
      let result = await this.MongooseServiceInstance.find({ clientEmail: body.clientEmail })
      if (result.length != null || result.length != 0) {
        return result;
      }
      return result
    } 
    catch (err) {
      console.log(err)
      return { Status: 500, Error: `${err.name} : ${err.message} `, Location: "./Src/Services/employee.service.js - findOne(body)" };
    }
  }
  
  async findProfessionalAppointments(body) {
    try {
      let result = await this.MongooseServiceInstance.find({ professionalEmail: body.professionalEmail })
      if (result.length != null || result.length != 0) {
        return result;
      }
      return result
    } 
    catch (err) {
      console.log(err)
      return { Status: 500, Error: `${err.name} : ${err.message} `, Location: "./Src/Services/employee.service.js - findOne(body)" };
    }
  }
  
  async getAppointment(body) {
    try {
      let result = await this.MongooseServiceInstance.findOne({ appointmentId: body.appointmentId })
      if (result.length != null || result.length != 0) {
        return result;
      }
      return result
    } 
    catch (err) {
      console.log(err)
      return { Status: 500, Error: `${err.name} : ${err.message} `, Location: "./Src/Services/employee.service.js - findOne(body)" };
    }
  }

  async updateOne(body) {
    try {
      let result = await this.MongooseServiceInstance.updateOne({ appointmentId: body.appointmentId }, body);
      if (result.modifiedCount === 1) {
        return { message: "success" }
      }
      return result;
    } 
    catch (err) {
      console.log(err)
      return { Status: 500, Error: `${err.name} : ${err.message} `, Location: "./Src/Services/employee.service.js - updateOne(body)" };
    }
  }

  async updateClientFiles(body) {
    try {
      let appointment = await this.MongooseServiceInstance.findOne({ appointmentId: body.appointmentId });
      if (appointment.appointmentId === body.appointmentId && appointment.clientDocuments.length > 0) {
        console.log("in already have")
      
        for (const url of appointment.clientDocuments) {
          try {
            await aws.deletefile(url);
          } catch (err) {
            console.error(`Delete failed:`, err);
          }
        }
        const uploadedUrls = [];
        for (const url of body.clientDocuments) {
          const fileName = url.split('/static/Temp/')[1];
          const localFilePath = path.resolve(__dirname, '../../Public/Temp', fileName);
          try {
            const aws_url = await aws.uploadfile(localFilePath);
            uploadedUrls.push(aws_url.Location);
            fs.unlink(localFilePath, (err) => {
              if (err) console.error(`Failed to delete ${fileName}:`, err);
              else console.log(`Deleted temp file: ${fileName}`);
            });
          } catch (err) {
            console.error(`Upload failed for ${fileName}:`, err);
          }
        }
        appointment.clientDocuments = uploadedUrls;
        appointment.clientDocumentsUploaded = body.clientDocumentsUploaded;
        let result = await this.MongooseServiceInstance.updateOne({ appointmentId: appointment.appointmentId }, appointment);
        if (result.modifiedCount === 1) {
          return { message: "success" }
        }
        return result;
      }
      
      if (appointment.appointmentId === body.appointmentId && appointment.clientDocuments.length === 0) {
        console.log("in no documents")
        const uploadedUrls = [];
        for (const url of body.clientDocuments) {
          const fileName = url.split('/static/Temp/')[1];
          console.log(fileName)
          const localFilePath = path.resolve(__dirname, '../../Public/Temp', fileName);
          try {
            const aws_url = await aws.uploadfile(localFilePath);
            uploadedUrls.push(aws_url.Location);
            fs.unlink(localFilePath, (err) => {
              if (err) console.error(`Failed to delete ${fileName}:`, err);
              else console.log(`Deleted temp file: ${fileName}`);
            });
          } catch (err) {
            console.error(`Upload failed for ${fileName}:`, err);
          }
        }
        appointment.clientDocuments = uploadedUrls;
        appointment.clientDocumentsUploaded = body.clientDocumentsUploaded;
        let result = await this.MongooseServiceInstance.updateOne({ appointmentId: appointment.appointmentId }, appointment);
        if (result.modifiedCount === 1) {
          return { message: "success" }
        }
        return result;
      }
    } 
    catch (err) {
      console.log(err)
      return { Status: 500, Error: `${err.name} : ${err.message} `, Location: "./Src/Services/employee.service.js - updateOne(body)" };
    }
  }

  async updateProfessionalFiles(body) {
    try {
      let appointment = await this.MongooseServiceInstance.findOne({ appointmentId: body.appointmentId });
      if (appointment.appointmentId === body.appointmentId && appointment.professionalDocuments.length > 0) {
        console.log("in update professional files")
      
        for (const url of appointment.professionalDocuments) {
          try {
            await aws.deletefile(url);
          } catch (err) {
            console.error(`Delete failed:`, err);
          }
        }
        const uploadedUrls = [];
        for (const url of body.professionalDocuments) {
          const fileName = url.split('/static/Temp/')[1];
          const localFilePath = path.resolve(__dirname, '../../Public/Temp', fileName);
          try {
            const aws_url = await aws.uploadfile(localFilePath);
            uploadedUrls.push(aws_url.Location);
            fs.unlink(localFilePath, (err) => {
              if (err) console.error(`Failed to delete ${fileName}:`, err);
              else console.log(`Deleted temp file: ${fileName}`);
            });
          } catch (err) {
            console.error(`Upload failed for ${fileName}:`, err);
          }
        }
        appointment.professionalDocuments = uploadedUrls;
        appointment.professionalDocumentsUploaded = body.professionalDocumentsUploaded;
        let result = await this.MongooseServiceInstance.updateOne({ appointmentId: appointment.appointmentId }, appointment);
        if (result.modifiedCount === 1) {
          return { message: "success" }
        }
        return result;
      }
      
      if (appointment.appointmentId === body.appointmentId && appointment.professionalDocuments.length === 0) {
        console.log("in no documents")
        const uploadedUrls = [];
        for (const url of body.professionalDocuments) {
          const fileName = url.split('/static/Temp/')[1];
          console.log(fileName)
          const localFilePath = path.resolve(__dirname, '../../Public/Temp', fileName);
          try {
            const aws_url = await aws.uploadfile(localFilePath);
            uploadedUrls.push(aws_url.Location);
            fs.unlink(localFilePath, (err) => {
              if (err) console.error(`Failed to delete ${fileName}:`, err);
              else console.log(`Deleted temp file: ${fileName}`);
            });
          } catch (err) {
            console.error(`Upload failed for ${fileName}:`, err);
          }
        }
        appointment.professionalDocuments = uploadedUrls;
        appointment.professionalDocumentsUploaded = body.professionalDocumentsUploaded;
        let result = await this.MongooseServiceInstance.updateOne({ appointmentId: appointment.appointmentId }, appointment);
        if (result.modifiedCount === 1) {
          return { message: "success" }
        }
        return result;
      }
    } 
    catch (err) {
      console.log(err)
      return { Status: 500, Error: `${err.name} : ${err.message} `, Location: "./Src/Services/employee.service.js - updateOne(body)" };
    }
  }

  async createId() {
    try {
      let codeExist;
      let code;
      do {
        const randomSixDigit = Math.floor(100000 + Math.random() * 900000);
        code = 'A-' + randomSixDigit;
        codeExist = await this.MongooseServiceInstance.findOne({ appointmentId: code });
      } while (codeExist);
      return code;
    } 
    catch (err) {
      console.log(err)
      return { Status: 500, Error: `${err.name} : ${err.message} `, Location: "./Src/Services/employee.service.js - findEmailExist(email)" };
    }
  }

  // ============ UPDATED FEEDBACK/COMPLAINT SYSTEM ============
  
  /**
   * @description Submit client feedback for an appointment
   * @param body {object} Object containing appointmentId, satisfied, complaintType, complaintMessage
   * @returns {Object}
   */
  async submitClientFeedback(body) {
    try {
      console.log(body)
      let appointment = await this.MongooseServiceInstance.findOne({ appointmentId: body.appointmentId });
      
      if (!appointment) {
        return { message: 'Appointment not found' };
      }

      // Set client feedback
      appointment.clientFeedback = {
        satisfied: body.satisfied,
        complaintType: body.complaintType || '',
        complaintMessage: body.complaintMessage || '',
        submittedAt: new Date()
      };

      // Mark client as completed
      appointment.appointmentCompletedByClient = true;

      // If client has a complaint
      if (body.satisfied === false) {
        appointment.hasComplaint = true;
        appointment.complaintStatus = 'pending';
        appointment.appointmentStatus = 'under_review';
      } else {
        // Client is satisfied - check if we can complete the appointment
        // Only complete if: professional also completed AND no active complaints
        if (appointment.appointmentCompletedByProfessional === true) {
          if (!appointment.hasComplaint || appointment.complaintStatus === 'resolved') {
            appointment.appointmentStatus = 'completed';
            appointment.appointmentCompleted = true;
          }
          // If there's an unresolved complaint from professional, status stays as is
        }
      }

      let result = await this.MongooseServiceInstance.updateOne({ appointmentId: body.appointmentId }, appointment);
      if (result.modifiedCount === 1) {
        return { message: 'success', appointment };
      }
      return { message: 'failed' };
    } 
    catch (err) {
      console.log(err);
      return { Status: 500, Error: `${err.name} : ${err.message}`, Location: "./Src/Services/appointment.service.js - submitClientFeedback(body)" };
    }
  }

  /**
   * @description Submit professional feedback for an appointment
   * @param body {object} Object containing appointmentId, satisfied, complaintType, complaintMessage
   * @returns {Object}
   */
  async submitProfessionalFeedback(body) {
    try {
      let appointment = await this.MongooseServiceInstance.findOne({ appointmentId: body.appointmentId });
      
      if (!appointment) {
        return { message: 'Appointment not found' };
      }

      // Set professional feedback
      appointment.professionalFeedback = {
        satisfied: body.satisfied,
        complaintType: body.complaintType || '',
        complaintMessage: body.complaintMessage || '',
        submittedAt: new Date()
      };

      // Mark professional as completed
      appointment.appointmentCompletedByProfessional = true;

      // If professional has a complaint
      if (body.satisfied === false) {
        appointment.hasComplaint = true;
        appointment.complaintStatus = 'pending';
        appointment.appointmentStatus = 'under_review';
      } else {
        // Professional is satisfied - check if we can complete the appointment
        // Only complete if: client also completed AND no active complaints
        if (appointment.appointmentCompletedByClient === true) {
          if (!appointment.hasComplaint || appointment.complaintStatus === 'resolved') {
            appointment.appointmentStatus = 'completed';
            appointment.appointmentCompleted = true;
          }
          // If there's an unresolved complaint from client, status stays as is
        }
      }

      let result = await this.MongooseServiceInstance.updateOne({ appointmentId: body.appointmentId }, appointment);
      if (result.modifiedCount === 1) {
        return { message: 'success', appointment };
      }
      return { message: 'failed' };
    } 
    catch (err) {
      console.log(err);
      return { Status: 500, Error: `${err.name} : ${err.message}`, Location: "./Src/Services/appointment.service.js - submitProfessionalFeedback(body)" };
    }
  }

  /**
   * @description Get all appointments with complaints (for admin)
   * @returns {Array}
   */
  async getComplaintAppointments() {
    try {
      let result = await this.MongooseServiceInstance.find({ hasComplaint: true });
      return result;
    } 
    catch (err) {
      console.log(err);
      return { Status: 500, Error: `${err.name} : ${err.message}`, Location: "./Src/Services/appointment.service.js - getComplaintAppointments()" };
    }
  }

  /**
   * @description Update complaint status (for admin)
   * @param body {object} Object containing appointmentId and complaintStatus
   * @returns {Object}
   */
  async updateComplaintStatus(body) {
    try {
      let appointment = await this.MongooseServiceInstance.findOne({ appointmentId: body.appointmentId });
      
      if (!appointment) {
        return { message: 'Appointment not found' };
      }

      appointment.complaintStatus = body.complaintStatus;

      // If complaint is resolved and both parties have completed, mark appointment as completed
      if (body.complaintStatus === 'resolved') {
        if (appointment.appointmentCompletedByClient === true && appointment.appointmentCompletedByProfessional === true) {
          appointment.appointmentStatus = 'completed';
          appointment.appointmentCompleted = true;
        }
      }

      let result = await this.MongooseServiceInstance.updateOne({ appointmentId: body.appointmentId }, appointment);
      if (result.modifiedCount === 1) {
        return { message: 'success', appointment };
      }
      return { message: 'failed' };
    } 
    catch (err) {
      console.log(err);
      return { Status: 500, Error: `${err.name} : ${err.message}`, Location: "./Src/Services/appointment.service.js - updateComplaintStatus(body)" };
    }
  }

    /**
     * @description Get single appointment by ID
     * @param appointmentId {string} Appointment ID
     * @returns {Object}
     */
    async getAppointmentById(appointmentId) {
    try {
        let result = await this.MongooseServiceInstance.findOne({ appointmentId: appointmentId });
        if (result) {
        return result;
        }
        return { message: 'Appointment not found' };
    } 
    catch (err) {
        console.log(err);
        return { Status: 500, Error: `${err.name} : ${err.message}`, Location: "./Src/Services/appointment.service.js - getAppointmentById(appointmentId)" };
    }
    }
  // ============ END ============
}

module.exports = FileService;