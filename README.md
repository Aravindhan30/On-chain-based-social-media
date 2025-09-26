# OnChain Social Feed Prototype

## Steps to Run
1. Install dependencies
   ```bash
   npm install
   npm run bootstrap
   ```
2. Compile contracts
   ```bash
   npx hardhat compile
   ```
3. Run tests
   ```bash
   npx hardhat test
   ```
4. Start local node
   ```bash
   npx hardhat node
   ```
5. Deploy locally
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```
6. Run frontend
   ```bash
   cd frontend
   npm run dev
   ```
