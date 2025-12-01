require("@nomicfoundation/hardhat-toolbox");
require("@typechain/hardhat");
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    axionaxTestnet: {
      url: process.env.RPC_URL || "https://axionax.org/rpc/",
      chainId: 86137,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};
