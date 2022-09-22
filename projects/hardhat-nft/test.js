require("dotenv").config();

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

let prefix = process.env.RPC;
if (prefix != "ALCHEMY" && prefix != "INFURA" && prefix != "POKT") {
  console.log(prefix);
  throw "not supported RPC endpoint";
}

const KOVAN_RPC_URL = process.env[prefix.concat("_KOVAN_RPC_URL")] || "";
const GOERLI_RPC_URL = process.env[prefix.concat("_GOERLI_RPC_URL")] || "";
const MUMBAI_RPC_URL = process.env[prefix.concat("_MUMBAI_RPC_URL")] || "";
const ARBY_RPC_URL = process.env[prefix.concat("_ARBY_RPC_URL")] || "";
const OP_RPC_URL = process.env[prefix.concat("_OP_RPC_URL")] || "";
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "";
const PRIVATE_KEY =
  process.env.PRIVATE_KEY || "0x11ee3108a03081fe260ecdc106554d09d9d1209bcafd46942b10e02943effc4a";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
