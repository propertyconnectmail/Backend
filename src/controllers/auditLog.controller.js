const file = require( "../services/auditLog.service" );
const FileService = new file();

module.exports = { createAuditLog , findAllAuditLogs };

/**
 * @description Create a record with the provided body
 */
async function createAuditLog ( req, res ) {
  try {
    const result = await FileService.create( req.body);
    return res.send( result );
  } catch ( err ) {
    console.log( err ); 
    res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
  }
}


/**
 * @description Get specific Professional with the email provided by body
 */
async function findAllAuditLogs ( req, res ) {
    try {
      const result = await FileService.find( req.body);
      return res.send( result );
    } catch ( err ) {
      console.log( err ); 
      res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
    }
  }