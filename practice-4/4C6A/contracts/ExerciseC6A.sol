pragma solidity ^0.5.8;

contract ExerciseC6A {

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    uint constant M = 2;
    struct UserProfile {
        bool isRegistered;
        bool isAdmin;
    }

    address private contractOwner;                  // Account used to deploy contract
    mapping(address => UserProfile) userProfiles;   // Mapping for storing user profiles
    bool private operational = true;
    address[] multiCalls = new address[](0);


    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/

    // No events

    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor
                                (
                                )
                                public
    {
        contractOwner = msg.sender;
        // Register five admins to enable 3 of 5 control
        // registerUser("ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f",true);
        // registerUser("0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1",true);
        // registerUser("c88b703fb08cbea894b6aeff5a544fb92e78a18e19814cd85da83b71f772aa6c",true);
        // registerUser("388c684f0ba1ef5017716adb5d21a053ea8e90277d0868337519f97bede61418",true);
        // registerUser("659cbb0e2411a44db63778987b1e22153c086a95eb6b18bdf89de078917abc63",true);
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    /**
    * @dev Modifier that requires the contract to be in an operational state
    */
    modifier isOperational()
    {
        require(operational == true, "Contract is not currently operational");
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

   /**
    * @dev Check if a user is registered
    *
    * @return A bool that indicates if the user is registered
    */
    function isUserRegistered
                            (
                                address account
                            )
                            external
                            view
                            returns(bool)
    {
        require(account != address(0), "'account' must be a valid address.");
        return userProfiles[account].isRegistered;
    }

    /**
    * @dev Set operational state of the contract
    *
    */
    function setOperationalState
                            (
                                bool opState
                            )
                            external
                            // requireContractOwner()
    {
        // operational = opState;
        require(opState != operational, "New mode must be different from existing operational state");
        require(userProfiles[msg.sender].isAdmin, "Caller is not an admin");

        bool isDuplicate = false;
        for(uint c = 0; c < multiCalls.length; c++){
            if (multiCalls[c] == msg.sender) {
                isDuplicate = true;
                break;
            }
        }

        require(!isDuplicate, "Caller has already called this function");

        multiCalls.push(msg.sender);
        if (multiCalls.length >= M) {
            operational = opState;
            multiCalls = new address[](0);
        }
    }



    /**
    * @dev Get operational state of the contract
    *
    */
    function getOperationalState()
                            external
                            view
                            returns(bool)
    {
        return operational;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

    function registerUser
                                (
                                    address account,
                                    bool isAdmin
                                )
                                external
                                isOperational()
                                requireContractOwner()
    {
        require(!userProfiles[account].isRegistered, "User is already registered.");

        userProfiles[account] = UserProfile({
                                                isRegistered: true,
                                                isAdmin: isAdmin
                                            });
    }
}

