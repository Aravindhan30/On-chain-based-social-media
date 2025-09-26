import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from './OnChainSocial.json';
import { CONTRACT_ADDRESS } from './config';

function App() {
  const [account, setAccount] = useState(null);
  const [posts, setPosts] = useState([]);
  const [contract, setContract] = useState(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
      setContract(contract);
      loadPosts(contract);
    }
  }, []);

  async function connectWallet() {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);
  }

  async function createPost() {
    await contract.createPost(content);
    setContent("");
    loadPosts(contract);
  }

  async function loadPosts(contract) {
    const count = await contract.getPostsCount();
    let allPosts = [];
    for (let i = 0; i < count; i++) {
      const post = await contract.getPost(i);
      allPosts.push(post);
    }
    setPosts(allPosts);
  }

  async function likePost(id) {
    await contract.likePost(id);
    loadPosts(contract);
  }

  async function tipPost(id) {
    await contract.tipPost(id, { value: ethers.utils.parseEther("0.001") });
    loadPosts(contract);
  }

  return (
    <div className="p-6">
      <button onClick={connectWallet}>
        {account ? "Connected: " + account.substring(0, 6) : "Connect Wallet"}
      </button>
      <div>
        <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Post content" />
        <button onClick={createPost}>Create Post</button>
      </div>
      <div>
        {posts.map((p, idx) => (
          <div key={idx} className="border p-2 m-2">
            <p>Author: {p.author}</p>
            <p>Content: {p.contentHash}</p>
            <p>Likes: {p.likes.toString()}</p>
            <p>Tips: {ethers.utils.formatEther(p.tips)} ETH</p>
            <button onClick={() => likePost(idx)}>Like</button>
            <button onClick={() => tipPost(idx)}>Tip</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
