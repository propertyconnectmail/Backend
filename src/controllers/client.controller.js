const file = require( "../services/client.service" );
const FileService = new file();

module.exports = { clientRegister , findClient , updateClient , deleteClient, findAllClients, updatePicture, updatePassword, addCard, updateCard, getCards, getCard, deleteCard};

/**
 * @description Create a record with the provided body
 */
async function clientRegister ( req, res ) {
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
async function findClient ( req, res ) {
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
async function findAllClients ( req, res ) {
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
async function updateClient ( req, res ) {
    try {
      const result = await FileService.updateOne( req.body);
      return res.send( result );
    } catch ( err ) {
      console.log( err ); 
      res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
    }
  }


    /**
 * @description Update specific Professional with the email provided by body
 */
async function updatePicture ( req, res ) {
  try {
    const result = await FileService.updateClientPicture( req.body);
    return res.send( result );
  } catch ( err ) {
    console.log( err ); 
    res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
  }
}


    /**
 * @description Update specific Professional with the email provided by body
 */
    async function updatePassword ( req, res ) {
      try {
        const result = await FileService.updatePassword( req.body);
        return res.send( result );
      } catch ( err ) {
        console.log( err ); 
        res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
      }
    }


  
    /**
   * @description Delete specific user with the email provided by body
   */
  async function deleteClient ( req, res ) {
      try {
        const result = await FileService.deleteOne( req.body);
        return res.send( result );
      } catch ( err ) {
        console.log( err ); 
        res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
      }
    }



        /**
   * @description Delete specific user with the email provided by body
   */
  async function addCard ( req, res ) {
    try {
      const result = await FileService.addCard( req.body);
      return res.send( result );
    } catch ( err ) {
      console.log( err ); 
      res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
    }
  }



      /**
   * @description Delete specific user with the email provided by body
   */
      async function getCards ( req, res ) {
        try {
          const result = await FileService.getCards( req.body);
          return res.send( result );
        } catch ( err ) {
          console.log( err ); 
          res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
        }
      }


         /**
   * @description Delete specific user with the email provided by body
   */
         async function getCard ( req, res ) {
          try {
            const result = await FileService.getCard( req.body);
            return res.send( result );
          } catch ( err ) {
            console.log( err ); 
            res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
          }
        }



          /**
   * @description Delete specific user with the email provided by body
   */
  async function updateCard ( req, res ) {
    try {
      const result = await FileService.updateCard( req.body);
      return res.send( result );
    } catch ( err ) {
      console.log( err ); 
      res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
    }
  }



      /**
   * @description Delete specific user with the email provided by body
   */
      async function deleteCard ( req, res ) {
        try {
          const result = await FileService.deleteCard( req.body);
          return res.send( result );
        } catch ( err ) {
          console.log( err ); 
          res.status( 500 ).send( { Status: 500 , Success: false, Error : `${err.name} : ${err.message}`  } );
        }
      }