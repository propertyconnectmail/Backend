const file = require( "../services/appointment.service" );
const FileService = new file();

module.exports = { createAppointment, getAllAppointments, getAllClientAppointments, getAllProfessionalAppointments , getAppointment, updateAppointment, updateClientFiles, updateProfessionalFiles };

/**
 * @description Create a record with the provided body
 */
async function createAppointment ( req, res ) {
  try {
    const result = await FileService.create( req.body);
    return res.send( result );
  } catch ( err ) {
    console.log( err ); 
    res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
  }
}


/**
 * @description Create a record with the provided body
 */
async function getAllClientAppointments ( req, res ) {
  try {
    const result = await FileService.findClientAppointments( req.body);
    return res.send( result );
  } catch ( err ) {
    console.log( err ); 
    res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
  }
}


/**
 * @description Create a record with the provided body
 */
async function getAllAppointments ( req, res ) {
  try {
    const result = await FileService.find();
    return res.send( result );
  } catch ( err ) {
    console.log( err ); 
    res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
  }
}


/**
 * @description Create a record with the provided body
 */
async function getAllProfessionalAppointments ( req, res ) {
  try {
    const result = await FileService.findProfessionalAppointments( req.body);
    return res.send( result );
  } catch ( err ) {
    console.log( err ); 
    res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
  }
}



/**
 * @description Create a record with the provided body
 */
async function getAppointment ( req, res ) {
  try {
    const result = await FileService.getAppointment( req.body);
    return res.send( result );
  } catch ( err ) {
    console.log( err ); 
    res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
  }
}



/**
 * @description Create a record with the provided body
 */
async function updateAppointment ( req, res ) {
  try {
    const result = await FileService.updateOne( req.body);
    return res.send( result );
  } catch ( err ) {
    console.log( err ); 
    res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
  }
}


/**
 * @description Create a record with the provided body
 */
async function updateClientFiles ( req, res ) {
  try {
    const result = await FileService.updateClientFiles( req.body);
    return res.send( result );
  } catch ( err ) {
    console.log( err ); 
    res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
  }
}



/**
 * @description Create a record with the provided body
 */
async function updateProfessionalFiles ( req, res ) {
  try {
    const result = await FileService.updateProfessionalFiles( req.body);
    return res.send( result );
  } catch ( err ) {
    console.log( err ); 
    res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
  }
}