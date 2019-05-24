/**
 *                          Blockchain Class
 *  The Blockchain class contain the basics functions to create your own private blockchain
 *  It uses libraries like `crypto-js` to create the hashes for each block and `bitcoinjs-message` 
 *  to verify a message signature. The chain is stored in the array
 *  `this.chain = [];`. Of course each time you run the application the chain will be empty because and array
 *  isn't a persisten storage method.
 *  
 */

const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./block.js');
const bitcoinMessage = require('bitcoinjs-message');
const Moment = require('moment');

class Blockchain {

    /**
     * Constructor of the class, you will need to setup your chain array and the height
     * of your chain (the length of your chain array).
     * Also everytime you create a Blockchain class you will need to initialized the chain creating
     * the Genesis Block.
     * The methods in this class will always return a Promise to allow client applications or
     * other backends to call asynchronous functions.
     */
    constructor() {
        this.chain = [];
        this.height = -1;
        this.initializeChain();
    }

    /**
     * This method will check for the height of the chain and if there isn't a Genesis Block it will create it.
     * You should use the `addBlock(block)` to create the Genesis Block
     * Passing as a data `{data: 'Genesis Block'}`
     */
    async initializeChain() {
        if( this.height === -1){
            let block = new BlockClass.Block({data: 'Genesis Block'});
            await this._addBlock(block);
        }
    }

    /**
     * Utility method that return a Promise that will resolve with the height of the chain
     */
    getChainHeight() {
        return new Promise((resolve, reject) => {
            resolve(this.height);
        });
    }

    /**
     * _addBlock(block) will store a block in the chain
     * @param {*} block 
     * The method will return a Promise that will resolve with the block added
     * or reject if an error happen during the execution.
     * You will need to check for the height to assign the `previousBlockHash`,
     * assign the `timestamp` and the correct `height`...At the end you need to 
     * create the `block hash` and push the block into the chain array. Don't for get 
     * to update the `this.height`
     * Note: the symbol `_` in the method name indicates in the javascript convention 
     * that this method is a private method. 
     */
    _addBlock(block) {
        let self = this;
        let currentChainHeight = self.height;

        return new Promise(async (resolve, reject) => {
            
            if (self.chain.length > 0) {
                block.previousBlockHash = self.chain[self.chain.length-1].hash;
            }
            block.time = new Date().getTime().toString().slice(0,-3);
            block.height = self.chain.length;
            block.hash = SHA256(JSON.stringify(block)).toString();
            console.log(`current hash: ${block.hash}`);

            if (block.hash) {             
                self.height = currentChainHeight + 1; 
                self.chain.push(block)  
                resolve(block); 
            } else {
                reject(Error("hashing failed"));
            }
        
           
        });
       
    }

    /**
     * The requestMessageOwnershipVerification(address) method
     * will allow you  to request a message that you will use to
     * sign it with your Bitcoin Wallet (Electrum or Bitcoin Core)
     * This is the first step before submit your Block.
     * The method return a Promise that will resolve with the message to be signed
     * @param {*} address 
     */
    requestMessageOwnershipVerification(address) {
        return new Promise((resolve) => {
            // ugh, this was hard to figure out what they were trying to say.  In the course material
            // they placed this in tick marks which cuased the markdown to turn this into code... when 
            // they actually wanted the tick marks included. Ugh.
            let message = `${address}:${new Date().getTime().toString().slice(0,-3)}:starRegistry`;
            resolve(message);            
        });
    }

    /**
     * The submitStar(address, message, signature, star) method
     * will allow users to register a new Block with the star object
     * into the chain. This method will resolve with the Block added or
     * reject with an error.
     * Algorithm steps:
     * 1. Get the time from the message sent as a parameter example: `parseInt(message.split(':')[1])`
     * 2. Get the current time: `let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));`
     * 3. Check if the time elapsed is less than 5 minutes
     * 4. Veify the message with wallet address and signature: `bitcoinMessage.verify(message, address, signature)`
     * 5. Create the block and add it to the chain
     * 6. Resolve with the block added.
     * @param {*} address 
     * @param {*} message 
     * @param {*} signature 
     * @param {*} star 
     */
    submitStar(address, message, signature, star) {     
        let self = this;        
        let currentTime = Moment.unix(parseInt(new Date().getTime().toString().slice(0, -3)));        
        let messageTime = Moment.unix(parseInt(message.split(':')[1]));                
        let timeDelta = Math.abs(Moment.duration(messageTime.diff(currentTime)).as('minutes'));        
        let dataObj = {
            "address" : address,
            "message" : message,
            "signature" : signature,
            "star" : star
        };

        return new Promise(async (resolve, reject) => {
            let verified = bitcoinMessage.verify(message, address, signature)
            if ( timeDelta <= 50000 && verified){
                let block = new BlockClass.Block(dataObj);  
                console.log(`the block is: ${block}`)              
                resolve(self._addBlock(block));
            } else {
                console.log(`block not valid: \ntimeDelta:${timeDelta} \nverification status: ${verified}`);
                reject(Error(`block not valid: timeDelta:${timeDelta} | verification status: ${verified}`));
            }
            
        });
    }

    /**
     * This method will return a Promise that will resolve with the Block
     *  with the hash passed as a parameter.
     * Search on the chain array for the block that has the hash.
     * @param {*} hash 
     */
    getBlockByHash(hash) {
        let self = this;
        return new Promise((resolve, reject) => {
           let foundBlock = self.chain.filter(block => block.hash === hash);
           if (foundBlock){
               resolve(foundBlock)
           } else {
               console.log("couldn't find that block")
               reject(Error("couldn't find that block."));
           }
        });
    }

    /**
     * This method will return a Promise that will resolve with the Block object 
     * with the height equal to the parameter `height`
     * @param {*} height 
     */
    getBlockByHeight(height) {
        let self = this;
        return new Promise((resolve, reject) => {
            let block = self.chain.filter(p => p.height === height)[0];
            if(block){
                resolve(block);
            } else {
                resolve(null);
            }
        });
    }

    /**
     * This method will return a Promise that will resolve with an array of Stars objects existing in the chain 
     * and are belongs to the owner with the wallet address passed as parameter.
     * Remember the star should be returned decoded.
     * @param {*} address 
     */
    getStarsByWalletAddress (address) {
        let self = this;
        let stars = [];
        let decodedData = {}

        for (let i=0; i < self.chain.length; ++i) {                            
            decodedData = self.chain[i].getBData();            
            if (decodedData.address && decodedData.address === address){
                stars.push({
                        "owner" : decodedData.address,
                        "star" : decodedData.star
                    });
            } else {
                console.log(`wrong-address or decodedData.address does not exist`);
                console.log(`decodedData.address: ${decodedData.address}`);                    
            }
        }
       

        return new Promise((resolve, reject) => {        

            // if any starts are in the array then return the array
            if (stars.length > 0){
                console.log("length is greater than zero");
                resolve(stars);
            } else {
                console.log("length is NOT greater than zero");
                reject("no stars were found.");
            }
            
            
        });
    }

    /**
     * This method will return a Promise that will resolve with the list of errors when validating the chain.
     * Steps to validate:
     * 1. You should validate each block using `validateBlock`
     * 2. Each Block should check the with the previousBlockHash
     */
    validateChain() {
        let self = this;
        let errorLog = [];
        return new Promise(async (resolve, reject) => {
            self.chain.forEach(function(block){
                let validBlock = block.validate();
                // Genisis Block does not have a value for previous block hash.  Only validate that the 
                // hash of the block itself is still valid. 
                if (validBlock.height === 0){
                    console.log(`self.height (from validateChain): ${self.height}`);
                    console.log(`self.chain.length (from validateChain): ${self.chain.length}`);
                    let expectedHash = validBlock.previousBlockHash;
                    let actualHash = self.chain[validBlock.height-1].hash;
                    if (expectedHash != actualHash){
                        errorLog.push(`Error with block with block of height: ${block.height}`)
                    }
                }                
            });
            if (errorLog){
                console.log(errorLog);
                resolve(errorLog);
            } else {
                reject(Error('there was an error generating the error log'));
            }
        });
    }

}

module.exports.Blockchain = Blockchain;   