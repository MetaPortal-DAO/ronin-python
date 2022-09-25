const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const { getNamedAccounts, ethers } = require("hardhat");
require("dotenv").config();

const goerli_link = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
const address = "0xa02f533c8eb69708cbe7df579093bf5518abc485";
const RPC = process.env.RPC;
const network = "GOERLI";

async function main() {
  // alchemy-token-api/alchemy-web3-script.js
  // Replace with your Alchemy api key:

  if (RPC === "ALCHEMY") {
    // Initialize an alchemy-web3 instance:
    const web3 = createAlchemyWeb3(process.env.ALCHEMY_GOERLI_RPC_URL);
    const ownerAddr = "0xA02F533C8EB69708cBE7dF579093bf5518abC485";
    const balances = await web3.alchemy.getTokenBalances(ownerAddr, [goerli_link]);

    console.log("BALANCES->");
    console.log(balances);
  } else {
    const rpcurl = process.env[RPC.concat("_", network, "_", "RPC_URL")];
    let provider = new ethers.providers.JsonRpcProvider(rpcurl);

    let balance = await provider.getBalance(address);
    console.log("BALANCE->");
    console.log(balance);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
