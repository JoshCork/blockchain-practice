
var Test = require('../config/testConfig.js');

contract('ExerciseC6A', async (accounts) => {

  var config;
  before('setup contract', async () => {
    config = await Test.Config(accounts);
  });

  it('contract owner can register new user', async () => {

    // ARRANGE
    let caller = accounts[0]; // This should be config.owner or accounts[0] for registering a new user
    let newUser = config.testAddresses[0];

    // ACT
    await config.exerciseC6A.registerUser(newUser, false, {from: caller});
    let result = await config.exerciseC6A.isUserRegistered.call(newUser);

    // ASSERT
    assert.equal(result, true, "Contract owner cannot register new user");

  });

  it('contract owner can toggle set contract operational state to false', async () => {

    // ARRANGE
    let caller = accounts[0]; // This should be config.owner or accounts[0] for registering a new user


    // ACT
    await config.exerciseC6A.setOperationalState(false, {from: caller});
    let result = await config.exerciseC6A.getOperationalState({from:caller});

    // ASSERT
    assert.equal(result, false, "Contract should not be active... but alas it is.");

  });


});
