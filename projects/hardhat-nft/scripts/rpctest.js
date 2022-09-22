const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const dynamicsSvgNFT = await ethers.getContract("DynamicSvgNft", deployer);
  const mintFee = ethers.utils.parseEther("0.1");

  for (let i = 0; i < 10; i++) {
    const highValue = ethers.utils.parseEther("2000");
    const dyanmicSvgNftMintTx = await dynamicsSvgNFT.mintNft(highValue.toString());
    await dyanmicSvgNftMintTx.wait(1);
    console.log(`${i} num NFT minted`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
