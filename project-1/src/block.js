/**
 *                          Block class
 *  The Block class is a main component into any Blockchain platform, 
 *  it will store the data and act as a dataset for your application.
 *  The class will expose a method to validate the data... The body of
 *  the block will contain an Object that contain the data to be stored,
 *  the data should be stored encoded.
 *  All the exposed methods should return a Promise to allow all the methods 
 *  run asynchronous.
 */

const SHA256 = require('crypto-js/sha256');
const hex2ascii = require('hex2ascii');

class Block {

    // Constructor - argument data will be the object containing the transaction data
	constructor(data){
		this.hash = null;                                           // Hash of the block
		this.height = 0;                                            // Block Height (consecutive number of each block)
		this.body = Buffer(JSON.stringify(data)).toString('hex');   // Will contain the transactions stored in the block, by default it will encode the data
		this.time = 0;                                              // Timestamp for the Block creation
		this.previousBlockHash = null;                              // Reference to the previous Block Hash
    }
    
    /**
     *  validate() method will validate if the block has been tampered or not.
     *  Been tampered means that someone from outside the application tried to change
     *  values in the block data as a consecuence the hash of the block should be different.
     *  Steps:
     *  1. Return a new promise to allow the method be called asynchronous.
     *  2. Save the in auxiliary variable the current hash of the block (`this` represent the block object)
     *  3. Recalculate the hash of the entire block (Use SHA256 from crypto-js library)
     *  4. Compare if the auxiliary hash value is different from the calculated one.
     *  5. Resolve true or false depending if it is valid or not.
     *  Note: to access the class values inside a Promise code you need to create an auxiliary value `let self = this;`
     */
    validate() {
        let self = this;
        return new Promise((resolve, reject) => {
            // Save in auxiliary variable the current block hash                      
                                            
            // Recalculate the hash of the Block
            let auxHash = SHA256(JSON.stringify(self));

            // Comparing if the hashes changed
            // Returning the Block is not valid
            if (self.hash != auxHash) {
                reject(Error("Block is not valid"))
            } else {// Returning the Block is valid
                resolve(self);
            }            
        });
    }

    /**
     *  Auxiliary Method to return the block body (decoding the data)
     *  Steps:
     *  
     *  1. Use hex2ascii module to decode the data
     *  2. Because data is a javascript object use JSON.parse(string) to get the Javascript Object
     *  3. Resolve with the data and make sure that you don't need to return the data for the `genesis block` 
     *     or Reject with an error.
     */
    getBData() {
        let self = this;
        
        // Resolve with the data if the object isn't the Genesis block
        /* 
        Josh's notes: Not sure if this needs to be a promise.  Seems silly as the purpose
        of the promise is to make sure that the functionality contained within the promise worked.
        I only used a pomise here because of the language that was used in the ruberick.  Also, I asssume
        that calling getBData on the genisis block to get the data out of that block shouldn't be something that
        should be disallowed? The wording in the 'step 2' project work discriptions reads:

        "Resolve with the data and make sure that you don't need to return the data for the 'genesis block' or Reject with an error."

        */
       //TODO: Refactor once I understand this requirement better. 
        return new Promise((resolve,reject) => {
            // Getting the encoded data saved in the Block
            let encodedBody = self.body;
            // Decoding the data to retrieve the JSON representation of the object
            let decodedBody = hex2ascii(encodedBody);
            // Parse the data to an object to be retrieve.
            let bodyObject = JSON.parse(decodedBody);

            if (self.height = 0) {
                reject(Error("this is the genisis block"))
            } else {
                resolve(bodyObject);
            }

        });
    }

}

module.exports.Block = Block;                    // Exposing the Block class as a module