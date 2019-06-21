/*##########################
CONFIGURATION
##########################*/

// -- Step 1: Set up the appropriate configuration 
var Web3 = require("web3") 
var EthereumTransaction = require("ethereumjs-tx").Transaction
var web3 = new Web3('HTTP://127.0.0.1:7545')

// -- Step 2: Set the sending and receiving addresses for the transaction. 
var  sendingAddress = '0x9993ecf5856127C29E422bDeBa469c657E413065' 
var receivingAddress = '0x90b727c60f559cDD0e1DFf8c097D8a90c23d2df5'

/*##########################
CREATE A TRANSACTION
##########################*/

// -- Step 4: Set up the transaction using the transaction variables as shown 
// 10000000000000000 --> .01 Ether
// 0000000000000000
var rawTransaction = { nonce: 5, to: receivingAddress, gasPrice: 20000000, gasLimit: 30000, value: 10000000000000000, data: "" }

/*##########################
Sign the Transaction
##########################*/

// -- Step 7: Sign the transaction with the Hex value of the private key of the sender 
var privateKeySender = '2fba2f9185be7ca34b9bfff7179c5a9754467821885c4d33f7a4e1b69a193377' 
var privateKeySenderHex = new Buffer(privateKeySender, 'hex') 
var transaction = new EthereumTransaction(rawTransaction) 
transaction.sign(privateKeySenderHex)

/*#########################################

Send the transaction to the network
#########################################*/

// -- Step 8: Send the serialized signed transaction to the Ethereum network. 
var serializedTransaction = transaction.serialize(); 
web3.eth.sendSignedTransaction(serializedTransaction);


