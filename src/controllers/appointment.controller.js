const file = require("../services/appointment.service");
const FileService = new file();

module.exports = { 
  createAppointment, 
  getAllAppointments, 
  getAllClientAppointments, 
  getAllProfessionalAppointments, 
  getAppointment, 
  updateAppointment, 
  updateClientFiles, 
  updateProfessionalFiles,
  // ============ ADDED FOR FEEDBACK/COMPLAINT SYSTEM ============
  submitClientFeedback,
  submitProfessionalFeedback,
  getComplaintAppointments,
  updateComplaintStatus,
  getAllAppointments,
  getAppointmentById
  // ============ END ============
};

/**
 * @description Create a record with the provided body
 */
async function createAppointment(req, res) {
  try {
    const result = await FileService.create(req.body);
    return res.send(result);
  } catch (err) {
    console.log(err); 
    res.status(500).send({ Status: 500, Success: false, Error: `${err.name} : ${err.message}` });
  }
}

/**
 * @description Create a record with the provided body
 */
async function getAllClientAppointments(req, res) {
  try {
    const result = await FileService.findClientAppointments(req.body);
    return res.send(result);
  } catch (err) {
    console.log(err); 
    res.status(500).send({ Status: 500, Success: false, Error: `${err.name} : ${err.message}` });
  }
}

/**
 * @description Create a record with the provided body
 */
async function getAllAppointments(req, res) {
  try {
    const result = await FileService.find();
    return res.send(result);
  } catch (err) {
    console.log(err); 
    res.status(500).send({ Status: 500, Success: false, Error: `${err.name} : ${err.message}` });
  }
}

/**
 * @description Create a record with the provided body
 */
async function getAllProfessionalAppointments(req, res) {
  try {
    const result = await FileService.findProfessionalAppointments(req.body);
    return res.send(result);
  } catch (err) {
    console.log(err); 
    res.status(500).send({ Status: 500, Success: false, Error: `${err.name} : ${err.message}` });
  }
}

/**
 * @description Create a record with the provided body
 */
async function getAppointment(req, res) {
  try {
    const result = await FileService.getAppointment(req.body);
    return res.send(result);
  } catch (err) {
    console.log(err); 
    res.status(500).send({ Status: 500, Success: false, Error: `${err.name} : ${err.message}` });
  }
}

/**
 * @description Create a record with the provided body
 */
async function updateAppointment(req, res) {
  try {
    const result = await FileService.updateOne(req.body);
    return res.send(result);
  } catch (err) {
    console.log(err); 
    res.status(500).send({ Status: 500, Success: false, Error: `${err.name} : ${err.message}` });
  }
}

/**
 * @description Create a record with the provided body
 */
async function updateClientFiles(req, res) {
  try {
    const result = await FileService.updateClientFiles(req.body);
    return res.send(result);
  } catch (err) {
    console.log(err); 
    res.status(500).send({ Status: 500, Success: false, Error: `${err.name} : ${err.message}` });
  }
}

/**
 * @description Create a record with the provided body
 */
async function updateProfessionalFiles(req, res) {
  try {
    const result = await FileService.updateProfessionalFiles(req.body);
    return res.send(result);
  } catch (err) {
    console.log(err); 
    res.status(500).send({ Status: 500, Success: false, Error: `${err.name} : ${err.message}` });
  }
}

// ============ ADDED FOR FEEDBACK/COMPLAINT SYSTEM ============

/**
 * @description Submit client feedback for an appointment
 */
async function submitClientFeedback(req, res) {
  try {
    const result = await FileService.submitClientFeedback(req.body);
    console.log(req.body)
    return res.send(result);
  } catch (err) {
    console.log(err); 
    res.status(500).send({ Status: 500, Success: false, Error: `${err.name} : ${err.message}` });
  }
}

/**
 * @description Submit professional feedback for an appointment
 */
async function submitProfessionalFeedback(req, res) {
  try {
    const result = await FileService.submitProfessionalFeedback(req.body);
    return res.send(result);
  } catch (err) {
    console.log(err); 
    res.status(500).send({ Status: 500, Success: false, Error: `${err.name} : ${err.message}` });
  }
}

  // Get all appointments (for admin)
  exports.getAllAppointments = async (req, res) => {
    try {
      const result = await AppointmentService.find({});
      return res.send(result);
    } catch (error) {
      return res.status(500).send({ message: 'Error fetching appointments', error });
    }
  };

  // Get single appointment by ID
  exports.getAppointmentById = async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const result = await AppointmentService.findOne({ appointmentId });
      
      if (!result) {
        return res.status(404).send({ message: 'Appointment not found' });
      }
      
      return res.send(result);
    } catch (error) {
      return res.status(500).send({ message: 'Error fetching appointment', error });
    }
  };

/**
 * @description Get all appointments with complaints (for admin)
 */
async function getComplaintAppointments(req, res) {
  try {
    const result = await FileService.getComplaintAppointments();
    return res.send(result);
  } catch (err) {
    console.log(err); 
    res.status(500).send({ Status: 500, Success: false, Error: `${err.name} : ${err.message}` });
  }
}

/**
 * @description Get single appointment by ID (for admin)
 */
async function getAppointmentById(req, res) {
  try {
    const result = await FileService.getAppointmentById(req.params.appointmentId);
    return res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send({ Status: 500, Success: false, Error: `${err.name} : ${err.message}` });
  }
}

/**
 * @description Update complaint status (for admin)
 */
async function updateComplaintStatus(req, res) {
  try {
    const result = await FileService.updateComplaintStatus(req.body);
    return res.send(result);
  } catch (err) {
    console.log(err); 
    res.status(500).send({ Status: 500, Success: false, Error: `${err.name} : ${err.message}` });
  }
}

// ============ END ============