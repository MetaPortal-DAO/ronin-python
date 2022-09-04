// can't pretend to be the chainlink vrf but we will listen for the chainlink vrf to fire
const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const { developmentChains, networkConfig } = require("../../helper-hardhat-config");
const { assert, expect } = require("chai");
const { experimentalAddHardhatNetworkMessageTraceHook } = require("hardhat/config");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle Staging Tests", function () {
      let raffle, raffleEntranceFee, deployer;

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        // no fixtures b/c we will run our deploy scripts and contract will be there on goerli
        raffle = await ethers.getContract("raffle", deployer);
        raffleEntranceFee = await raffle.getEntranceFee();
        await raffle.enterRaffle({ value: raffleEntranceFee });
      });

      describe("fullfillRandomWords", function () {
        it("it works with live Chainlink Keepers and Chainilnk VRF, we get a random winner", async function () {
          const startingTimeStampt = await raffle.getLatestTimeStamp();
          const accounts = await ethers.getSigners();

          // this is the balance after they have moved funds
          // gas not a thing b/c chainlink keepers pay the gas not the contract
          const winnerStartingBalance = await accounts[0].getBalance();

          // b/c there is an await - nothing will be executed after until this stops executing
          await new Promise(async (resolve, reject) => {
            raffle.once("WinnerPicked", async () => {
              console.log("WinnerPicked Event Fired");
              try {
                const recentWinner = await raffle.getRecentWinner();
                const raffleState = await raffle.getRaffleState();
                const winnerEndingBalance = await accounts[0].getBalance();
                const endingTimeStamp = await raffle.getLatestTimeStamp();

                await expect(raffle.getPlayer(0)).to.be.reverted;
                assert.equal(recentWinner.toString(), accounts[0].address);
                assert.equal(raffleState, 0);
                assert.equal(
                  winnerEndingBalance.toString(),
                  winnerStartingBalance.add(raffleEntranceFee.toString())
                );
                assert(endingTimeStamp > startingTimeStampt);
                resolve();
              } catch (e) {
                console.log(e);
                reject(e);
              }
            });
          });
        });
      });
    });
