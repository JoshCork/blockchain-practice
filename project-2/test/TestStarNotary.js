const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Star', async() => {
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
});

it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 3;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, {from: user2, value: balance});
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance});
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
    assert.equal(value, starPrice);
});

// Implement Task 2 Add supporting unit tests

it('can add the star name and star symbol properly', async() => {
    
    // 1.  create a Star with different tokenId
    // 2.  Call the name and symbol properties in your 
    //     Smart Contract and compare with the name and symbol provided

    let expSymbol = "IOAC";
    let expName = "agraCoin";
    let tokenId = 100;
    let instance = await StarNotary.deployed();
    await instance.createStar(expName, tokenId, {from: accounts[0]});    
    assert.equal(await instance.symbol.call(),expSymbol);
    assert.equal(await instance.name.call(),expName);
});

it('lets 2 users exchange stars', async() => {    
    // Set up parameters
    let firstName = "origOwner 201";
    let secondName = "origOwner 202";
    let firstOwner = accounts[0];
    let secondOwner = accounts[1];
    let firstTokeID = 201;
    let secondTokeID = 202;
    let instance = await StarNotary.deployed();

    // Create Stars
    await instance.createStar(firstName, firstTokeID, {from: firstOwner});    
    await instance.createStar(secondName, secondTokeID, {from: secondOwner});

    // Request Exchange
    await instance.exchangeStars(firstTokeID, secondTokeID, {from: accounts[0]});

    // Check Ownership
    assert.equal(await instance.ownerOf.call(firstTokeID), secondOwner);
    assert.equal(await instance.ownerOf.call(secondTokeID), firstOwner);
});

it('lets a user transfer a star', async() => {

    // Set up parameters
    let starName = "origOwner acc[0]";
    let firstOwner = accounts[0];
    let secondOwner = accounts[1];
    let firstTokeID = 301;    
    let instance = await StarNotary.deployed();

    // Create Star
    await instance.createStar(starName, firstTokeID, {from: firstOwner});
    
    // transferStar
    await instance.transferStar(secondOwner, firstTokeID, {from: firstOwner});

    // Check Ownership
    assert.equal(await instance.ownerOf.call(firstTokeID), secondOwner);
});

it('lookUptokenIdToStarInfo test', async() => {
    // Set up parameters
    let starName = "superstar";
    let firstOwner = accounts[0];
    let firstTokeID = 401;    
    let instance = await StarNotary.deployed();

    // Create Star
    await instance.createStar(starName, firstTokeID, {from: firstOwner});

    // Using tokenIdToStarInfo verify starName
    assert.equal(await instance.tokenIdToStarInfo.call(firstTokeID), starName)
});