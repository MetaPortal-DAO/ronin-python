//last step before deploying to mainnet

const { inputToConfig } = require("@ethereum-waffle/compiler");
const { getNamedAccounts, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { assert } = require("chai");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("Fundme", async function () {
      let DynamicSvgNft;
      let deployer;
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("DynamicSvgNft", deployer);
      });

      for (let i = 0; i < 2; i++) {
        const highValue = ethers.utils.parseEther("2000");
        const dyanmicSvgNftMintTx = await dynamicsSvgNFT.mintNft(highValue.toString());
        await dyanmicSvgNftMintTx.wait(1);
        console.log(`${i} num NFT minted`);
      }
    });
