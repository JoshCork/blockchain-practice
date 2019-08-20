pragma solidity ^0.5.8;

contract ExerciseC6A {

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/


    struct UserProfile {
        bool isRegistered;
        bool isAdmin;
    }

    address private contractOwner;                  // Account used to deploy contract
    mapping(address => UserProfile) userProfiles;   // Mapping for storing user profiles
    bool private operational = true;



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
                            requireContractOwner()
    {
        operational = opState;
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
                                requireContractOwner
                                isOperational()
    {
        require(!userProfiles[account].isRegistered, "User is already registered.");

        userProfiles[account] = UserProfile({
                                                isRegistered: true,
                                                isAdmin: isAdmin
                                            });
    }
}

