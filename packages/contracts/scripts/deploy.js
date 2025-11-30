const hre = require("hardhat");

async function main() {
  console.log("Deploying EscrowManager...");

  const escrow = await hre.ethers.deployContract("EscrowManager");
  await escrow.waitForDeployment();

  const address = await escrow.getAddress();
  console.log("EscrowManager deployed to:", address);
  console.log("Please update NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS in .env");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
