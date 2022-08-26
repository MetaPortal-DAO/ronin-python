// where we will populate constructor vars for deploy

const networkConfig = {
  5: {
    name: "goerli",
    ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
  },
  137: {
    name: "polygon",
    ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
  },
};

// but what about the hardhat network!

const developmentChain = ["hardhat", "localhost"];
const DECIMALS = 8;
const INITIAL_ANSWER = 160000000000;

module.exports = {
  networkConfig,
  developmentChain,
  DECIMALS,
  INITIAL_ANSWER,
};
