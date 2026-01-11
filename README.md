# Blockchain-Based Certificate Verification System

A decentralized application (DApp) for issuing and verifying certificates using Ethereum blockchain.

## Features
- **Issue Certificates**: Authorized issuers can mint non-transferable certificates.
- **Verify Certificates**: Anyone can verify certificate authenticity using a Certificate ID.
- **Robust Validation**: Smart contract ensures no empty or duplicate certificates.
- **No-Wallet Verification**: Verification works without Metamask (using read-only JSON-RPC).

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Ethers.js v6
- **Backend**: Hardhat, Solidity 0.8.28

## Prerequisites
- Node.js (v18+)
- Metamask (Browser Extension)

## Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
npx hardhat node
```
*Keep this terminal running.*

### 2. Deploy Contract
In a new terminal:
```bash
cd backend
npx hardhat run scripts/deploy.js --network localhost
```

### 3. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/)

## Usage
1.  **Connect Wallet**: Click "Connect Wallet".
    - You must switch to **Hardhat Localhost** (Chain ID: 31337).
    - Import a test account from the Hardhat node output using its Private Key.
2.  **Issue**: Go to "Issue Certificate" tab and fill details.
3.  **Verify**: Log out or switch accounts (optional). Go to "Verify Certificate" tab and enter the ID.

## Pictures
<img width="1470" height="830" alt="Blockchain_P1" src="https://github.com/user-attachments/assets/b9ee60b0-8956-49a1-a459-b8a98f84943d" />
<img width="1470" height="830" alt="Blockchain_P2" src="https://github.com/user-attachments/assets/b19b03be-ba2a-430a-b8cb-d76ff2d79ef5" />
<img width="1470" height="830" alt="Blockchain_P3" src="https://github.com/user-attachments/assets/4cfc2f80-7724-4953-b862-c84bace0d4e6" />
<img width="1470" height="830" alt="Blockchain_P4" src="https://github.com/user-attachments/assets/9e17f752-d63d-4ad8-b2a5-569ffd4ad269" />

## Contract Address
The contract address is automatically saved to `frontend/src/contracts/contract-address.json` after deployment.
