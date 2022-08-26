//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
  // library can't have state variables, all functions internal and can't send eth
  // library is like defining methods on existing classes?

  function getPrice(AggregatorV3Interface priceFeed)
    internal
    view
    returns (uint256)
  {
    // need ABI and address of the contract to interact with other contract.
    // address 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
    // abi get the ABI with an interface
    // to interact with other contracts you need interface and address
    (, int256 price, , , ) = priceFeed.latestRoundData();
    return uint256(price * 1e10);
  }

  function getConversionRate(uint256 ethAmount, AggregatorV3Interface priceFeed)
    internal
    view
    returns (uint256)
  {
    uint256 ethPrice = getPrice(priceFeed);
    uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
    return ethAmountInUsd;
  }
  // now you can use dot operator as a method on whatever you define as using this library
}
