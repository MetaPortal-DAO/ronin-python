const { developmentChains, networkConfig } = require("../helper-hardhat-config");

const BASE_FEE = ethers.utils.parseEther("0.25"); // 0.25 is the premium in Link / request.
const GAS_PRICE_LINK = 1e9; // calculated value based on gas price of y
const DECIMALS = "18";
const INITAL_PRICE = ethers.utils.parseUnits("1500");
// like the link per gas

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const args = [BASE_FEE, GAS_PRICE_LINK];

  if (developmentChains.includes(network.name)) {
    log("Local network detected! Deploying mocks");
    //deploy mock vrf coordinator
    await deploy("VRFCoordinatorV2Mock", {
      from: deployer,
      log: true,
      args: args,
    });

    await deploy("MockV3Aggregator", {
      from: deployer,
      log: true,
      args: [DECIMALS, INITAL_PRICE],
    });

    log("Mocks Deployed!");
    log("-------------------------------");
  }
};

module.exports.tags = ["all", "mocks"];
