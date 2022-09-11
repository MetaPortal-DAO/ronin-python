const { assert } = require("chai");
const { network, deployments, ethers } = require("hardhat");
const {
  TASK_COMPILE_SOLIDITY_HANDLE_COMPILATION_JOBS_FAILURES,
} = require("hardhat/builtin-tasks/task-names");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("RandomIpfsNft", function () {
      let deployer, randomIpfsNft, mintFee, VRFCoordinatorV2Mock;

      beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["mocks", "main"]);
        randomIpfsNft = await ethers.getContract("RandomIpfsNft");
        VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer);
        mintFee = ethers.utils.parseEther("0.1");
      });

      describe("requestNFT", () => {
        it("updates requestIdToSender array correctly", async () => {});
        it("emits NFT requested event", async () => {});
      });

      describe("fulfillRandomWords", () => {
        it("correctly increments the token counter", async () => {
          const tx = await randomIpfsNft.requestNft({ value: mintFee });
          const txReceipt = await tx.wait(1);
          const tx1 = await VRFCoordinatorV2Mock.fulfillRandomWords(
            txReceipt.events[1].args.requestid,
            randomIpfsNft.address
          );
          const txReceipt1 = await tx1.wait(1);
          const tokenCounter = await randomIpfsNft.getTokenCounter();
          assert.equal(tokenCounter, 1);
        });

        it("");
      });

      describe("withdraw", () => {
        it("withdraws all funds from mint succesfully", async () => {
          // mint a couple first
        });
      });
    });
