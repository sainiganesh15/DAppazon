
# Dappazon

Dappazon is a simple decentralized marketplace built on the Ethereum blockchain using Solidity. It allows users to buy and sell items using ether. The marketplace is owned by the contract owner who is responsible for listing new products and withdrawing funds from the contract.

## Getting Started

To get started with Dappazon, you will need to have an Ethereum wallet such as MetaMask installed on your browser. You can then connect to the Ethereum network and interact with the Dappazon contract.

## Prerequisites

Before you can run the tests, make sure you have the following installed:

- Node.js
- Hardhat
- React

## Features
### Listing products

The contract owner can list new products on the marketplace by calling the `list` function. The `list` function takes in the following parameters:

- `id` - The unique ID of the product.
- `name` - The name of the product.
- `category` - The category of the product.
- `image` - The image URL of the product.
- `cost` - The cost of the product in ether.
- `rating` - The rating of the product.
- `stock` - The stock of the product.

### Buying products
Users can buy products from the marketplace by calling the buy function and sending enough ether to cover the cost of the product. The buy function takes in the following parameter:

- `id` - The ID of the product to be bought.
### Withdrawing Funds
The contract owner can withdraw funds from the contract by calling the withdraw function.

### Listing Products with IPFS
The contract owner can list new products on the marketplace with an associated IPFS hash for the product details.   
To upload the product details to IPFS, you can use a library such as `ipfs-api` to connect to an IPFS node and add the data to IPFS. You can then store the resulting hash on the blockchain as part of the product details.

### Retrieving Products from IPFS
To retrieve the product details from IPFS, you can use the IPFS hash stored in the product details and use ipfs-api to fetch the data from IPFS. Once you have the data, you can use it to display the product details on the marketplace.

### Frontend Components
The Dappazon marketplace frontend is built using React and includes the following components:

- `App.js` - The main component that renders the marketplace and handles user interactions.
- `App.test.js` - The test file for the App.js component.
config.json - The configuration file for the Dappazon contract address and ABI.
- `index.css` - The CSS file for styling the marketplace.
### Contract ABIs
The contract ABIs are included in the abis directory and are used to interact with the Dappazon contract on the Ethereum blockchain.

## Installation

1. For Hardhat Installation
``` 
npm init --yes
npm install --save-dev hardhat
```

2. For running hardhat sample project install these dependencies:
```
npm install --save-dev @nomiclabs/hardhat-ethers@^2.0.5 @nomiclabs/hardhat-waffle@^2.0.3 
npm install --save-dev chai@^4.3.6 ethereum-waffle@^3.4.4 ethers@^5.6.2 hardhat@^2.9.2
```

## Deploying Smart Contract to Localhost

1. Write your smart contract in Solidity and save it in the `contracts/` folder.

2. In the `hardhat.config.js` file, configure your local development network by adding the following:

```
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
};

  ```

  3. In the `scripts/` folder, create a new script to deploy your contract to the local network:
  ```
 // We require the Hardhat Runtime Environment explicitly here. This is optional
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.


const hre = require("hardhat")
const { items } = require("../src/items.json")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  // setup accounts 
  const[deployer] = await ethers.getSigners()

  // Deploy Dappazon
  const Dappazon = await hre.ethers.getContractFactory("Dappazon")
  const dappazon = await Dappazon.deploy()
  await dappazon.deployed()

  console.log(`Deployed Dappazon Contract at: ${dappazon.address}\n`)

  // List items...
  for (let i = 0; i < items.length; i++) {
    const transaction = await dappazon.connect(deployer).list(
      items[i].id,
      items[i].name,
      items[i].category,
      items[i].image,
      tokens(items[i].price),
      items[i].rating,
      items[i].stock,
    )

    await transaction.wait()

    console.log(`Listed item ${items[i].id}: ${items[i].name}`)
  }

}

// recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

```
4. Compile and deploy the smart contract using Hardhat

```
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost

``` 

This will deploy your smart contract to the local development network.
## Running the Tests

To run the tests, use the following command:

`npx hardhat test
`

This will run all the tests in the `test` folder.

## Tests
The tests are located in the `test` folder and cover the following scenarios:

 Deployment
-  has a owner
Listing
- Returns item attributes
- Emits List event
Buying
- Updates the contract balance
- Updates buyer's order count
- Adds the order
- Update the contract balance
- Emits Buy Event
Withdrawing
- Update the owner balance
- Update the Contract Balance 


Writing unit tests for smart contracts is an essential part of the development process. Hardhat makes it easy to write and run tests, and can be used with a variety of testing frameworks.

In this repository, we have demonstrated how to write unit tests for a sample smart contract called **Dappazon**.

## Usage
To use the Dappazon marketplace, you can run the following commands in the terminal:


#### Clone the repository ####
`git clone https://github.com/sainiganesh15/DAppazon.git`

#### Install dependencies ####
```
cd Dappazon
npm install
```

#### Start the local development server ####
```
npm start
Once the server is running, you can access the Dappazon marketplace by navigating to http://localhost:3000 in your web browser.
```

## License
This project is licensed under the MIT.