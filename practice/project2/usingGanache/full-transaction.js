/*##########################
CONFIGURATION
##########################*/

// -- Step 1: Set up the appropriate configuration 
var Web3 = require("web3") 
var EthereumTransaction = require("ethereumjs-tx").Transaction
var web3 = new Web3('HTTP://127.0.0.1:7545')

// -- Step 2: Set the sending and receiving addresses for the transaction. 
var  receivingAddress = '0x9993ecf5856127C29E422bDeBa469c657E413065' 
var sendingAddress = '0x2E6ae9C4B26452579612e81dca8421f2741A39c5'

// -- Step 3: Check the balances of each address 
// web3.eth.getBalance(sendingAddress).then(console.log) 
// web3.eth.getBalance(receivingAddress).then(console.log)

/*##########################
CREATE A TRANSACTION
##########################*/

// -- Step 4: Set up the transaction using the transaction variables as shown 
var rawTransaction = { nonce: 1, to: receivingAddress, gasPrice: 20000000, gasLimit: 30000, value: 89999998729989999900, data: "" }

// -- Step 5: View the raw transaction 
console.log('executing step 5')
rawTransaction

// -- Step 6: Check the new account balances (they should be the same) 
web3.eth.getBalance(sendingAddress).then(console.log) 
web3.eth.getBalance(receivingAddress).then(console.log)

// Note: They haven't changed because they need to be signed...

/*##########################

Sign the Transaction
##########################*/

// -- Step 7: Sign the transaction with the Hex value of the private key of the sender 
var privateKeySender = '40eb9f2ec27db4a19a939e01e1a7eeabab4087d663bf4574f411ea9b508f6c1e' 
var privateKeySenderHex = new Buffer(privateKeySender, 'hex') 
var transaction = new EthereumTransaction(rawTransaction) 
transaction.sign(privateKeySenderHex)

/*#########################################

Send the transaction to the network
#########################################*/

// -- Step 8: Send the serialized signed transaction to the Ethereum network. 
var serializedTransaction = transaction.serialize(); 
web3.eth.sendSignedTransaction(serializedTransaction);

