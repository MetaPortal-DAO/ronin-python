const { getNamedAccounts, deployments, network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainid = network.config.chainId;

  const raffle = await deploy("raffle", {
    from: deployer,
    args: [ethers.utils.parseEther("1")],
    log: true,
  });
};

module.exports.tags = ["all", "raffle"];
