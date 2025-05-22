const file = require( "../services/official.service" );
const FileService = new file();

module.exports = { officialRegister , findOfficial , updateOfficial , deleteOfficial, finalAllOfficials};

/**
 * @description Create a record with the provided body
 */
async function officialRegister ( req, res ) {
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
async function findOfficial ( req, res ) {
    try {
      const result = await FileService.findOne( req.body);
      return res.send( result );
    } catch ( err ) {
      console.log( err ); 
      res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
    }
  }


  /**
 * @description Get specific Professional with the email provided by body
 */
async function finalAllOfficials ( req, res ) {
    try {
      const result = await FileService.find();
      return res.send( result );
    } catch ( err ) {
      console.log( err ); 
      res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
    }
  }


  /**
 * @description Update specific Professional with the email provided by body
 */
async function updateOfficial ( req, res ) {
    try {
      const result = await FileService.updateOne( req.body);
      return res.send( result );
    } catch ( err ) {
      console.log( err ); 
      res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
    }
  }


  
    /**
   * @description Delete specific user with the email provided by body
   */
  async function deleteOfficial ( req, res ) {
      try {
        const result = await FileService.deleteOne( req.body);
        return res.send( result );
      } catch ( err ) {
        console.log( err ); 
        res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
      }
    }