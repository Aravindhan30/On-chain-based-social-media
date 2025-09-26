const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OnChainSocial", function () {
  let Social, social, owner, user1;

  beforeEach(async () => {
    [owner, user1] = await ethers.getSigners();
    Social = await ethers.getContractFactory("OnChainSocial");
    social = await Social.deploy();
    await social.deployed();
  });

  it("Should create a post", async () => {
    await social.createPost("hello");
    const post = await social.getPost(0);
    expect(post.contentHash).to.equal("hello");
  });

  it("Should like a post", async () => {
    await social.createPost("hello");
    await social.connect(user1).likePost(0);
    const post = await social.getPost(0);
    expect(post.likes).to.equal(1);
  });

  it("Should tip a post", async () => {
    await social.createPost("hello");
    await social.connect(user1).tipPost(0, { value: ethers.utils.parseEther("1") });
    const post = await social.getPost(0);
    expect(post.tips).to.equal(ethers.utils.parseEther("1"));
  });
});
