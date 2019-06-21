pragma solidity ^0.5.8;

contract Messenger {
    string theMessage;
    
    function setMessage(string memory x) public {
        theMessage = x;
    }
    
    function getMessage() public view returns (string memory) {
        return theMessage;
    }
}