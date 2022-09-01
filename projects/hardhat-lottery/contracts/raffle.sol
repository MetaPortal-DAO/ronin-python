//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

contract raffle is VRFConsumerBaseV2, KeeperCompatibleInterface {
  /* State Variables */
  uint256 private immutable i_entranceFee;
  address payable[] private s_players;
  bytes32 private immutable i_gaslane;
  uint64 private immutable i_subscriptionId;
  uint16 private constant REQUEST_CONFIRMATIONS = 3;
  uint32 private immutable i_callbackGasLimit;
  uint32 private constant NUM_WORDS = 2;
  VRFCoordinatorV2Interface private immutable i_vrfCoordinator;

  // Lottery Variables
  address private s_recentWinner;

  /* Events */
  event RaffleEnter(address indexed player);
  event RequestedRaffleWinner(uint256 indexed requestId);
  event WinnerPicked(address indexed winner);

  error raffle__NotEnoughETHEntered();
  error raffle__TransferFailed();

  constructor(
    address VRFCoordinatorV2,
    uint256 entranceFee,
    bytes32 gasLane,
    uint64 subscriptionId,
    uint32 callbackGasLimit
  ) VRFConsumerBaseV2(VRFCoordinatorV2) {
    i_entranceFee = entranceFee;
    i_vrfCoordinator = VRFCoordinatorV2Interface(VRFCoordinatorV2);
    i_gaslane = gasLane;
    i_subscriptionId = subscriptionId;
    i_callbackGasLimit = callbackGasLimit;
  }

  function enterRaffle() public payable {
    if (msg.value < i_entranceFee) {
      revert raffle__NotEnoughETHEntered();
    }
    s_players.push(payable(msg.sender));
    emit RaffleEnter(msg.sender);
  }

  /**
   * @dev this is the function chainlink keepers call
   * they look for updkeepneeded to return true.
   * following should be ture in order to return ture:
   * 1. our time interval should have passed
   * 2. lottery should have at least 1 player and have some eth
   * 3. our subscription is funded with ETH.
   */
  function checkUpKeep(
    bytes calldata /*checkData*/
  ) external override {}

  // external cheaper than public
  function pickRandomWinner() external {
    // request random number and once we get it do something with it
    uint256 requestId = i_vrfCoordinator.requestRandomWords(
      i_gaslane, // gaslane
      i_subscriptionId,
      REQUEST_CONFIRMATIONS,
      i_callbackGasLimit,
      NUM_WORDS
    );
    emit RequestedRaffleWinner(requestId);
  }

  function fulfillRandomWords(
    uint256,
    /*requestId*/
    uint256[] memory randomWords
  ) internal override {
    uint256 indexOfWinner = randomWords[0] % s_players.length;
    address payable recentWinner = s_players[indexOfWinner];
    (bool success, ) = recentWinner.call{value: address(this).balance}("");
    if (!success) {
      revert raffle__TransferFailed();
    }
    emit WinnerPicked(recentWinner);
  }

  /* view / pure functinos
  function getEntranceFee() public view returns (uint256) {
    return i_entranceFee;
  }

  function getPlayer(uint256 index) public view returns (address) {
    return s_players[index];
  }

  function getRecentWinner() public view returns (address) {
    return s_recentWinner;
  }
}

// people should be able to
// enter the lottery, pay some amount
// pick a random winner (verifiably random)
// winner to be selected every x time -> completely automated

// need chainlink oracle -> randomess, automated execution (chainlink keepers)
