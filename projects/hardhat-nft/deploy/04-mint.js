const { network, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deployer } = await getNamedAccounts();

  const basicNft = await ethers.getContract("BasicNFT", deployer);
  const basicMintTx = await basicNft.mintNft();
  await basicMintTx.wait(1);
  console.log(`Basic NFT index 0 has tokenURI: ${await basicNft.tokenURI(0)}`);

  const randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer);
  const mintFee = await randomIpfsNft.getMintFee();

  await new Promise(async (resolve, reject) => {
    setTimeout(resolve, 30000); // 5 minutes to time out
    randomIpfsNft.once("NftMinted", async function () {
      reject();
    });
    const randonIpfsNftMintTx = await randomIpfsNft.requestNft({ value: mintFee.toString() });
    const randomIpfsNftMintTxReceipt = await randonIpfsNftMintTx.wait(1);
    if (developmentChains.includes(network.name)) {
      const requestId = randomIpfsNftMintTxReceipt.events[1].args.requestid.toString();
      const VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer);
      await VRFCoordinatorV2Mock.fulfillRandomWords(requestId, randomIpfsNft.address);
      resolve();
    }
  });
  console.log(`Random IPFS NFT index 0 token URI: ${await randomIpfsNft.tokenURI(0)}`);

  const highValue = ethers.utils.parseEther("4000");
  const dynamicSvgNft = await ethers.getContract("DynamicSvgNft", deployer);
  const dyanmicSvgNftMintTx = await dynamicSvgNft.mintNft(highValue.toString());
  await dyanmicSvgNftMintTx.wait(1);

  console.log(`Dynamic SVG token URI: ${await dynamicSvgNft.tokenURI(1)}`);
};

module.exports.tags = ["all", "mint"];
