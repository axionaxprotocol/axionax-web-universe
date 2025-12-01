const { ethers } = require("hardhat");

async function main() {
  console.log("Mining 20 blocks for testing...");
  for (let i = 0; i < 20; i++) {
    await ethers.provider.send("evm_mine");
  }
  console.log("Done mining.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
