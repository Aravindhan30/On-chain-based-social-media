
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract OnChainSocial {
    struct Post {
        uint id;
        address author;
        string contentHash;
        uint timestamp;
        uint likes;
        uint tips;
    }

    Post[] public posts;
    mapping(uint => mapping(address => bool)) public liked;
    mapping(uint => string[]) public comments;

    event PostCreated(uint id, address author, string contentHash);
    event PostLiked(uint id, address user);
    event CommentAdded(uint id, address user, string comment);
    event PostTipped(uint id, address from, uint amount);

    function createPost(string memory contentHash) external {
        uint id = posts.length;
        posts.push(Post(id, msg.sender, contentHash, block.timestamp, 0, 0));
        emit PostCreated(id, msg.sender, contentHash);
    }

    function likePost(uint postId) external {
        require(postId < posts.length, "Invalid post");
        require(!liked[postId][msg.sender], "Already liked");
        posts[postId].likes++;
        liked[postId][msg.sender] = true;
        emit PostLiked(postId, msg.sender);
    }

    function commentOnPost(uint postId, string memory comment) external {
        require(postId < posts.length, "Invalid post");
        comments[postId].push(comment);
        emit CommentAdded(postId, msg.sender, comment);
    }

    function tipPost(uint postId) external payable {
        require(postId < posts.length, "Invalid post");
        require(msg.value > 0, "Tip > 0");
        posts[postId].tips += msg.value;
        payable(posts[postId].author).transfer(msg.value);
        emit PostTipped(postId, msg.sender, msg.value);
    }

    function getPost(uint postId) external view returns (Post memory) {
        require(postId < posts.length, "Invalid post");
        return posts[postId];
    }

    function getPostsCount() external view returns (uint) {
        return posts.length;
    }
}
