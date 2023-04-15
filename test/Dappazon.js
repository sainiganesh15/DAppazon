const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

 // Global variable for listing on item...
 const ID = 1
 const NAME = "Shoes"
 const CATEGORY = "Clothing"
 const IMAGE = 'http://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg'
 const COST = tokens(1)
 const RATING = 4
 const STOCK = 5

describe("Dappazon", () => {
  let dappazon;
  let deployer, buyer;

  beforeEach(async () => {
    // Setup Accounts
    [deployer, buyer] = await ethers.getSigners()
    //console.log("deployer address", deployer.address, "buyer address", buyer.address);

    //deploy contracts and
    const Dappazon = await ethers.getContractFactory("Dappazon");
    dappazon = await Dappazon.deploy();
    await dappazon.deployed();


  })

  describe("Deployment", () => {
    
    it("has a owner", async() => {
      expect(await dappazon.owner()).to.equal(deployer.address)
    })
  })

  describe("Listing", () => {
    let transaction

    beforeEach(async () => {
      transaction = await dappazon.connect(deployer).list(
        ID,
        NAME,
        CATEGORY,
        IMAGE,
        COST,
        RATING,
        STOCK
      )

      await transaction.wait(); // basically the transaction being submitted to the blockchain what we're 
                                // doing is out of here we're just waiting for that transaction to finish its full life cycle before we run this test so after we just go fetch items
    })
    
    it("Returns item attributes", async() => {
      const item = await dappazon.items(ID) //fetching the items from mapping 
      expect(item.id).to.equal(ID)
      expect(item.name).to.equal(NAME)
      expect(item.category).to.equal(CATEGORY)
      expect(item.image).to.equal(IMAGE)
      expect(item.cost).to.equal(COST)
      expect(item.rating).to.equal(RATING)
      expect(item.stock).to.equal(STOCK)
    })

    it("Emits List event", () =>{
      expect(transaction).to.emit(dappazon, "List")
    })
  })

  describe("Buying", () => {
    let transaction

    beforeEach(async () =>{
      //List on item
      transaction = await dappazon.connect(deployer).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
      await transaction.wait()

      // Buy on item
      transaction = await dappazon.connect(buyer).buy(ID, { value: COST})
      await transaction.wait()
    })

    // it("should revert when not enough ether is sent", async function() {
    //   // Attempt to buy item with less ether than the cost
    //   const transaction = await dappazon.connect(buyer).buy(ID, {value: tokens(0.5)});
  
    //   // Assert that transaction reverts
    //   await expect(transaction).to.be.revertedWith("Dappazon: Insufficient ether sent");
    // });

    // it("should revert when item is out of stock", async function() {
    //   // Buy all items in stock
    //   for (let i = 0; i < STOCK; i++) {
    //     await dappazon.connect(buyer).buy(ID, {value: COST});
    //   }
  
    //   // Attempt to buy item when out of stock
    //   const tx = dappazon.connect(buyer).buy(ID, {value: COST});
  
    //   // Assert that transaction reverts
    //   await expect(tx).to.be.revertedWith("Dappazon: Item out of stock");
    // });

    it("Updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(dappazon.address)
      //console.log(result)
      expect(result).to.equal(COST)
    })

    it("Updates buyer's order count", async () => {
      const result = await dappazon.orderCount(buyer.address)
      expect(result).to.equal(1)
    })

    it("Adds the order", async () => {
      const order = await dappazon.orders(buyer.address, 1)

      expect(order.time).to.be.greaterThan(0)  //we can't get the exact time unless we freeze the blockchain
      expect(order.item.name).to.equal(NAME)
    })

    it("Update the contract balance", async () => {
      const result = await ethers.provider.getBalance(dappazon.address)
      expect(result).to.equal(COST)
    })

    it("Emits Buy Event", () => {
      expect(transaction).to.emit(dappazon, "Buy")
    })
  })

  describe("Withdrawing", () => {
    let balanceBefore

    beforeEach(async () => {
      // List an item
      let transaction = await dappazon.connect(deployer).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
      await transaction.wait()

      //buy a item
      transaction = await dappazon.connect(buyer).buy(ID, {value: COST})
      await transaction.wait()

      // Get a deployer balance before
      balanceBefore = await ethers.provider.getBalance(deployer.address)

      // withdraw 
      transaction = await dappazon.connect(deployer).withdraw()
      await transaction.wait()
    })

    it("Update the owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })

    it("Update the Contract Balance ", async () => {
      const result = await ethers.provider.getBalance(dappazon.address)
      expect(result).to.equal(0)
    })
  })
})
