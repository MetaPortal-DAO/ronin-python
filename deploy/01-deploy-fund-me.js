// all scripts in deploy folder will run when you run hardhat deploy

// wehenver you call this file execute the async func that takes hre
// syntactic sugar for extracing getnamedaccounts, deployments from hre that you get when you
// require("ethers") -> this is done for harhdat deploy at runetime

// now extracting deploy and log from deployments object (these are the functions/objects)

const { networkConfig, developmentChain } = require("../helper-hardhat-config");
const { network } = require("hardhat");
const { verify } = require("../utils/verify");
// this is like const helperconfig = require("../require-helper-config")+
// const networkConfig = helperconfig.networkConfig

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;

  // grabbing deployer account from hardhat config
  const { deployer } = await getNamedAccounts();
  let chainId = network.config.chaindId;

  // if chainid is x use address y for const fundme that uses deploy -> use network config

  // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];

  let ethUsdPriceFeedAddress;
  if (developmentChain.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
    log(`ETH Chainlink addy: ${ethUsdPriceFeedAddress} for ${network.name}`);
  } else {
    let chainId = network.config.chainId;
    log(`Chain id is ${chainId}`);
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    log(`ETH Chainlink addy: ${ethUsdPriceFeedAddress} for ${network.name}`);
  }

  // if the chain doesn't have that contract then deploy a mock/minimal ver of it for
  // local testing.

  // when going for local host or hardhat network we want to use a mock
  // what happens when we want to change chains - then contract addresses changes - pricefeed

  const args = [ethUsdPriceFeedAddress];
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args, // will put the pricefeed address - constructor args
    log: true,
    waitConfirmation: network.config.blockConfirmations || 1,
  });

  // if not in a development chain then verify
  if (
    !developmentChain.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args);
  }
  log("--------------------------");
};

module.exports.tags = ["all", "fundme"];
