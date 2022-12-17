import { ethers, upgrades } from "hardhat";
import { green } from "colors";
import deployed from "./deployed";


async function main() {

  const [dev] = await ethers.getSigners();
  console.log(green(`deploy with account: ${dev.address}`));

  const RebaseBadge = await ethers.getContractFactory("RebaseBadge");
  const badge = await upgrades.deployProxy(RebaseBadge, []);
  await badge.deployed();

  console.log(deployed.contracts)
  deployed.saveAddress('badge', badge.address);

  console.log(green(`Deploy RebaseBadge at:  ${badge.address}`));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
