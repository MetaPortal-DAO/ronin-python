const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  let raffleValue = ethers.utils.parseEther("1");
  const { deployer } = await getNamedAccounts();

  const raffle = await ethers.getContract("raffle", deployer);
  console.log(raffle);
  const transactionResponse = await raffle.enterRaffle({
    value: raffleValue,
  });
  await transactionResponse.wait(1);
  console.log(`Raffle Entered with ${raffleValue} at ${raffle.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
