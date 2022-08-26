//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// can import interfaces from github same as importing whole interface
// interface import ABI allows us call this contract

import "./PriceConverter.sol";

error NotOwner();

contract FundMe {
  //custom errors

  // constant, immutable - variable can't be changed. if its assigned at compile time

  using PriceConverter for uint256;

  // can use with constructor - something that is set once
  address public immutable i_owner;

  // constant = forever the same and not set in constructor

  uint256 public constant MINIMUM_USD = 50 * 1e18;

  // initalize the v3 interface object at the specified adddress - depends on chain
  AggregatorV3Interface public priceFeed;

  // gets called when contract is deployed
  constructor(address priceFeedAddress) {
    i_owner = msg.sender;
    priceFeed = AggregatorV3Interface(priceFeedAddress);
  }

  address[] public funders;

  mapping(address => uint256) public addressToAmountFunded;

  function fund() public payable {
    require(
      msg.value.getConversionRate(priceFeed) >= MINIMUM_USD,
      "Didn't send enough!"
    ); // 1e18 == 1eth
    funders.push(msg.sender);
    addressToAmountFunded[msg.sender] = msg.value;
  }

  // function withdraw

  function withdraw() public onlyOwner {
    for (
      uint256 funderIndex = 0;
      funderIndex < funders.length;
      funderIndex = funderIndex + 1
    ) {
      address funder = funders[funderIndex];
      addressToAmountFunded[funder] = 0;
    }
    // reset the array
    funders = new address[](0); // replace the entire array with a new zero array
    (bool callSuccess, ) = payable(msg.sender).call{
      value: address(this).balance
    }("");
    require(callSuccess, "Call failed");
  }

  // _ = doing the rest of the code, means first run the require, then
  modifier onlyOwner() {
    if (msg.sender != i_owner) revert NotOwner();
    _;
  }

  receive() external payable {
    fund();
  }

  fallback() external payable {
    fund();
  }

  // what happens if someone send the contract eth without calling fund

  // two special functions in solidity, receive and fallback
}

// notes
// revert = terminate and reverts anything from that tx and send remaining gas back,
// libarries = contracts with no state varialbes or can't send ethers
