/**
 * Importing the Block class
 */
//
const BlockClass = require('./block.js');
const SHA256 = require('crypto-js/sha256');

/**
 * Creating a block object
 */
const block = new BlockClass.Block("Test Block");

// Generating the block hash


block.generateHash().then((result) => {
	console.log(`Block Hash (results): ${result.hash}`);
  console.log(`Block (results): ${JSON.stringify(result)}`);
}).catch((error) => {console.log(error)});

/**
 * Step 3: Run the application in node.js
 * 
 */

// From the terminal: cd into Project folder
// From the terminal: Run node app.js to run the code