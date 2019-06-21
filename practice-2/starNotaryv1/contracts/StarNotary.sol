pragma solidity >=0.4.24;

contract StarNotary {

    string public starName;
    address public starOwner;

    event starClaimed(address owner);
    event starRenamed(string name);

    constructor() public {
        starName = "Awesome Udacity Star";
    }

    function claimStar() public {
        starOwner = msg.sender;
        emit starClaimed(msg.sender);
    }

    function nameChangy(string memory newName) public {
        starName = newName;
        emit starRenamed(starName);
    }

    // function changeName (string _name) public {
    //     starName = _name;
    // }

}