import { ethers, upgrades, network } from "hardhat";
import { green } from "colors";


async function main() {

  console.log(green(`Upgrade RebaseBadge contract...`));

  // const RebaseBadge = await ethers.getContractFactory("RebaseBadge");
  // const badge = await upgrades.upgradeProxy{
  //   ,
  //   RebaseBadge
  // }

  console.log(green(`========== ended ==========`))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
