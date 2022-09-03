const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const { developmentChains, networkConfig } = require("../../helper-hardhat-config");
const { assert, expect } = require("chai");
const { TransactionTypes } = require("ethers/lib/utils");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle Unit Tests", function () {
      let raffle, VRFCoordinatorV2Mock, raffleEntranceFee, deployer, interval;
      const chainId = network.config.chainId;

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        raffle = await ethers.getContract("raffle", deployer);
        VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer);
        raffleEntranceFee = await raffle.getEntranceFee();
        interval = await raffle.getInterval();
      });

      describe("constructor", function () {
        it("initializes the raffle correctly", async function () {
          // ideally we make our tests have just 1 assert per it
          const raffleState = await raffle.getRaffleState();

          // enums will output 0
          assert.equal(raffleState.toString(), "0");
          assert.equal(interval.toString(), networkConfig[chainId]["interval"]);
        });
      });

      describe("enterRaffle", function () {
        it("reverts when you don't pay enough", async function () {
          await expect(raffle.enterRaffle()).to.be.revertedWith("Raffle__NotEnoughETHEntered");
        });

        it("records players when they enter", async function () {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          const playerFromContract = await raffle.getPlayer(0);
          assert.equal(playerFromContract, deployer);
        });

        it("emits event on enter", async function () {
          await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.emit(
            raffle,
            "RaffleEnter"
          );
        });
        it("doesn't allow entrance when raffle is calculating", async function () {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          // need to make checkupkeep return true and then call perform upkeep
          await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
          await network.provider.send("evm_mine", []);
          // pretend to be a chainlink keepr
          await raffle.performUpkeep([]);
          // now in calculating state
          await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.be.revertedWith(
            "Raffle__NotOpen"
          );
        });
        describe("checkUpkeep", function () {
          it("returns false if people haven't sent any ETH", async function () {
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
            await network.provider.send("evm_mine", []);

            //call static - simulate sending tx and seeing what happens
            const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]);
            assert(!upkeepNeeded);
          });
          it("returns false if raffle isn't open", async function () {
            await raffle.enterRaffle({ value: raffleEntranceFee });
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
            await network.provider.send("evm_mine", []);

            //send blank bytes object or []
            await raffle.performUpkeep("0x");
            const raffleState = await raffle.getRaffleState();
            const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x");

            assert.equal(raffleState.toString(), "1");
            assert.equal(upkeepNeeded, false);
          });
          it("returns true if enough time has passed, has players, eth and is open", async function () {
            // ifrst needs to have eth
            await raffle.enterRaffle({ value: raffleEntranceFee });
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
            await network.provider.send("evm_mine", []);

            const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x");

            console.log(upkeepNeeded);
          });
        });
        describe("performUpkeep", function () {
          it("it can only run if checkUpkeep is true", async function () {
            await raffle.enterRaffle({ value: raffleEntranceFee });
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
            await network.provider.send("evm_mine", []);
            const tx = await raffle.performUpkeep("0x");
            assert(tx);
          });
          it("reverts when checkUpkeep is false", async function () {
            await expect(raffle.performUpkeep([])).to.be.revertedWith("Raffle__UpkeepNotNeeded");
          });
          it("updates the raffle state, emits an event and calls the vrf coordinator", async function () {
            await raffle.enterRaffle({ value: raffleEntranceFee });
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
            await network.provider.send("evm_mine", []);
            const txResponse = await raffle.performUpkeep([]);
            const txReceipt = await txResponse.wait(1);
            const requestId = txReceipt.events[1].args.requestId;
            const raffleState = await raffle.getRaffleState();
            assert(requestId.toNumber() > 0);
            assert(raffleState.toString() == "1");
          });
        });
        describe("fullfillRandomWords", function () {
          beforeEach(async function () {
            await raffle.enterRaffle({ value: raffleEntranceFee });
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
            await network.provider.send("evm_mine", []);
          });
          it("can only be called after performUpKeep", async function () {
            await expect(
              VRFCoordinatorV2Mock.fulfillRandomWords(0, raffle.address)
            ).to.be.revertedWith("nonexistent request");
            await expect(
              VRFCoordinatorV2Mock.fulfillRandomWords(1, raffle.address)
            ).to.be.revertedWith("nonexistent request");
          });
          // want to write a huge test - test that puts everything together
          // picks a winner, resets the lottery and sends the money
          it("picks a winner, resets, and sends money", async () => {
            const additionalEntrances = 3; // to test
            const startingIndex = 1;
            const accounts = await ethers.getSigners();
            for (let i = startingIndex; i < startingIndex + additionalEntrances; i++) {
              const accountConnectedRaffle = raffle.connect(accounts[i]); // Returns a new instance of the Raffle contract connected to player
              await accountConnectedRaffle.enterRaffle({ value: raffleEntranceFee });
            }
            const startingTimeStamp = await raffle.getLatestTimeStamp();

            await new Promise(async (resolve, reject) => {
              raffle.once("WinnerPicked", async () => {
                console.log("Found the event!");
                try {
                  const recentWinner = await raffle.getRecentWinner();
                  console.log(recentWinner);
                  console.log(accounts[2].address);
                  console.log(accounts[0].address);
                  console.log(accounts[1].address);
                  console.log(accounts[3].address);
                  const raffleState = await raffle.getRaffleState();
                  const endingTimeStamp = await raffle.getLatestTimeStamp();
                  const numPlayers = await raffle.getNumberOfPlayers();
                  const winnerEndingBalance = await accounts[1].getBalance();
                  assert.equal(numPlayers.toString(), "0");
                  assert.equal(raffleState.toString(), "0");
                  assert(endingTimeStamp > startingTimeStamp);

                  assert.equal(
                    winnerEndingBalance.toString(),
                    winnerStartingBalance.add(
                      raffleEntranceFee.mul(additionalEntrances).add(raffleEntranceFee).toString()
                    )
                  );
                } catch (e) {
                  reject(e);
                }
                resolve();
              });
              // setting up listener for winner picked (promise resolved when winer picked)
              const tx = await raffle.performUpkeep([]);
              const txReceipt = await tx.wait(1);
              const winnerStartingBalance = await accounts[1].getBalance();
              await VRFCoordinatorV2Mock.fulfillRandomWords(
                txReceipt.events[1].args.requestId,
                raffle.address
              );
            });
          });
        });
      });
    });
