const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const Contract = await hre.ethers.getContractFactory("OnChainSocial");
  const contract = await Contract.deploy();
  await contract.deployed();
  console.log("OnChainSocial deployed to:", contract.address);

  fs.writeFileSync("deployments.json", JSON.stringify({
    address: contract.address,
    network: hre.network.name,
    deployTx: contract.deployTransaction.hash
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
