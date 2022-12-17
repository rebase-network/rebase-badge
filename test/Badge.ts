import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import type { BigNumber } from "ethers";
import { send } from "process";
import exp from "constants";

describe("RebaseBadge", function () {

  let accounts: SignerWithAddress[];
  let receivers: String[];
  let ids: Number[];

  before(async () => {
    accounts = await ethers.getSigners();
    const balance = await accounts[0].getBalance();
    console.log('signer balance: ', ethers.utils.formatEther(balance));



    receivers = [
      accounts[0].address
      , accounts[1].address
      , accounts[2].address
      , accounts[3].address
      , accounts[4].address
      , accounts[5].address
      , accounts[6].address
      , accounts[7].address
      , accounts[8].address
      , accounts[9].address
    ];

    ids = [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10
    ];
  })

  it("Single Mint RebaseBadge", async function () {

    const RebaseBadge = await ethers.getContractFactory("RebaseBadge");
    let badge: Contract;

    badge = await upgrades.deployProxy(RebaseBadge, ["TestBadge", "ipfs://"]);
    console.log('badge at: ', badge.address);

    let tx = await badge.mint(receivers[0], ids[0], "0x");
    await tx.wait();

    let balance = await badge.balanceOf(receivers[0], ids[0]);
    expect(balance).to.equal(1);

    balance = await badge.balanceOf(receivers[0], ids[1]);
    expect(balance).to.equal(0);

    await expect(badge.safeTransferFrom(receivers[0], receivers[1], 1, 1, "0x")).to.be.revertedWith("RebaseBadge: This a Soulbound token. It cannot be transferred. It can only be burned by the token owner.");

  });

  it("mintBatch RebaseBadge", async function () {

    const RebaseBadge = await ethers.getContractFactory("RebaseBadge");
    let badge: Contract;

    badge = await upgrades.deployProxy(RebaseBadge, ["TestBadge", "ipfs://"]);
    console.log('badge at: ', badge.address);

    let tx = await badge.mintBatch(receivers[0], ids, "0x");
    await tx.wait();

    let balance = await badge.balanceOf(receivers[0], ids[0]);
    expect(balance).to.equal(1);

    balance = await badge.balanceOf(receivers[0], ids[1]);
    expect(balance).to.equal(1);
  });


  it("mintBatchAddresses RebaseBadge", async function () {

    const RebaseBadge = await ethers.getContractFactory("RebaseBadge");
    let badge: Contract;

    badge = await upgrades.deployProxy(RebaseBadge, ["TestBadge", "ipfs://"]);
    console.log('badge at: ', badge.address);

    let tx = await badge.mintBatchAddresses(receivers, ids, "0x");
    await tx.wait();

    let balance = await badge.balanceOf(receivers[0], ids[0]);
    expect(balance).to.equal(1);

    balance = await badge.balanceOf(receivers[1], ids[1]);
    expect(balance).to.equal(1);

    balance = await badge.balanceOf(receivers[2], ids[2]);
    expect(balance).to.equal(1);

    balance = await badge.balanceOf(receivers[3], ids[3]);
    expect(balance).to.equal(1);
  });

  it("mintAddresses RebaseBadge", async function () {

    const RebaseBadge = await ethers.getContractFactory("RebaseBadge");
    let badge: Contract;

    badge = await upgrades.deployProxy(RebaseBadge, ["TestBadge", "ipfs://"]);
    console.log('badge at: ', badge.address);

    let tx = await badge.mintAddresses(receivers, ids[0], "0x");
    await tx.wait();

    let balance = await badge.balanceOf(receivers[0], ids[0]);
    expect(balance).to.equal(1);

    balance = await badge.balanceOf(receivers[1], ids[0]);
    expect(balance).to.equal(1);
  });

});
