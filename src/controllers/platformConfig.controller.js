const file = require( "../services/platformConfig.service" );
const FileService = new file();

module.exports = { createPlatformConfig , updateTotalProfessionals, updateTotalClients , updateTotalRevenue, updateTotalAppointments, updateMaintainanceMode, findPlatformConfig };

/**
 * @description Create a record with the provided body
 */
async function createPlatformConfig ( req, res ) {
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
async function findPlatformConfig ( req, res ) {
    try {
      const result = await FileService.findPlatformConfig( req.body);
      return res.send( result );
    } catch ( err ) {
      console.log( err ); 
      res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
    }
}


/**
 * @description Get specific Professional with the email provided by body
 */
async function updateTotalProfessionals ( req, res ) {
    try {
      const result = await FileService.updateTotalProfessionals( req.body);
      return res.send( result );
    } catch ( err ) {
      console.log( err ); 
      res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
    }
  }


  /**
 * @description Get specific Professional with the email provided by body
 */
async function updateTotalClients ( req, res ) {
    try {
      const result = await FileService.updateTotalClients( req.body);
      return res.send( result );
    } catch ( err ) {
      console.log( err ); 
      res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
    }
  }


  
  /**
 * @description Get specific Professional with the email provided by body
 */
async function updateTotalRevenue ( req, res ) {
    try {
      const result = await FileService.updateTotalRevenue( req.body);
      return res.send( result );
    } catch ( err ) {
      console.log( err ); 
      res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
    }
  }


    /**
 * @description Get specific Professional with the email provided by body
 */
async function updateTotalAppointments ( req, res ) {
    try {
      const result = await FileService.updateTotalAppointments( req.body);
      return res.send( result );
    } catch ( err ) {
      console.log( err ); 
      res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
    }
}


  /**
 * @description Get specific Professional with the email provided by body
 */
  async function updateMaintainanceMode ( req, res ) {
    try {
      const result = await FileService.updateMaintainanceMode( req.body);
      return res.send( result );
    } catch ( err ) {
      console.log( err ); 
      res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
    }
}
