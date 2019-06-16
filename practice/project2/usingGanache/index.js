var Web3 = require('web3');
var url = 'HTTP://127.0.0.1:7545';
var web3 = new Web3(url);
var address = "0x9993ecf5856127C29E422bDeBa469c657E413065"
web3.eth.getAccounts().then(accounts => console.log(accounts));
web3.eth.getGasPrice().then(console.log)
// web3.eth.getUncle("latest",0).then(console.log)
web3.eth.getTransactionCount(address).then(console.log)
