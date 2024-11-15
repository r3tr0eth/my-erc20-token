import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyToken", function () {
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    
    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();
    
    return { myToken, owner, addr1, addr2 };
  }

  it("Should assign the total supply of tokens to the owner", async function () {
    const { myToken, owner } = await loadFixture(deployTokenFixture);
    const ownerBalance = await myToken.balanceOf(owner.address);
    expect(await myToken.totalSupply()).to.equal(ownerBalance);
  });

  it("Should transfer tokens between accounts", async function() {
    const { myToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);

    // Transfer 50 tokens from owner to addr1
    await expect(myToken.transfer(addr1.address, 50))
      .to.changeTokenBalances(myToken, [owner, addr1], [-50, 50]);

    // Transfer 50 tokens from addr1 to addr2
    await expect(myToken.connect(addr1).transfer(addr2.address, 50))
      .to.changeTokenBalances(myToken, [addr1, addr2], [-50, 50]);
  });

  it("Should fail if trying to mint more than max supply", async function() {
    const { myToken, owner, addr1 } = await loadFixture(deployTokenFixture);
    
    // 1000001 tokens con 18 decimales
    const maxAmount = ethers.getBigInt("1000001" + "0".repeat(18));
    
    await expect(
      myToken.mint(addr1.address, maxAmount)
    ).to.be.revertedWith("Max supply exceeded");
});

  it("Should pause and unpause token transfers", async function() {
    const { myToken, owner, addr1 } = await loadFixture(deployTokenFixture);
    
    await myToken.pause();
    await expect(
      myToken.transfer(addr1.address, 50)
    ).to.be.reverted;

    await myToken.unpause();
    await expect(
      myToken.transfer(addr1.address, 50)
    ).to.not.be.reverted;
  });
});