// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OurToken is ERC20 {
    // initial supply is 50 <- 50 wei.
    // all erc20s come with decimals - default is 18

    constructor(uint256 iniitalSupply) ERC20("OurToken", "OT") {
        _mint(msg.sender, initalSupply);
    }
}
