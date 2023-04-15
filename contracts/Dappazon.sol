// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Dappazon {
    address public owner;

    constructor(){
        owner=msg.sender;
    }

     struct Item {
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

      struct Order{
        uint256 time;
        Item item;
    }

    mapping(uint256 => Item) public items;
    mapping(address => uint256) public orderCount;
    mapping(address => mapping(uint256 => Order)) public orders;

    event Buy(address buyer, uint256 orderId, uint256 itemId);
    event List(string name, uint256 cost, uint256 quantity);

    
    modifier onlyOwner() {
        require(msg.sender==owner);
        _;                               // this means run require before function
    }


    //List Products
    function list(
        uint256 _id,
        string memory _name, 
        string memory _category,
        string memory _image,
        uint256 _cost,
        uint256 _rating,
        uint256 _stock
        ) public onlyOwner{
            
        // only owner of marketplace can list the items

        require(msg.sender == owner);
        
        //Create item  struct
        Item memory item = Item(
            _id,
            _name, 
            _category, 
            _image, 
            _cost, 
            _rating, 
            _stock
        );

        // Save Item struct to blockchain
        items[_id] = item;

        //emit an event
        emit List(_name, _cost, _stock);

        
    }

     //Buy Product
    function buy(uint256 _id) public payable{
        // Receive crypto by making function payable
        
        // fetch item
        Item memory item = items[_id];

        //Require enough ether to buy the product
        require(msg.value >= item.cost, "Insufficient ether sent");

        //require item is in stock
        require(item.stock > 0, "Product is not available");

        //create an order
        Order memory order = Order(block.timestamp, item);

        //Add order to chain
        orderCount[msg.sender]++;  // <-- Order ID
        orders[msg.sender][orderCount[msg.sender]] = order;

        //subtract stock
        items[_id].stock = item.stock - 1;

        // Emit event
        emit Buy(msg.sender, orderCount[msg.sender], item.id);
    }

      //Withdraw funds
    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }

}
