const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const CertificateRegistry = await hre.ethers.getContractFactory("CertificateRegistry");
    const certificateRegistry = await CertificateRegistry.deploy();

    await certificateRegistry.waitForDeployment();

    const address = await certificateRegistry.getAddress();

    console.log("CertificateRegistry deployed to:", address);

    // We also save the contract artifacts and address in the frontend directory
    saveFrontendFiles(address, "CertificateRegistry");
}

function saveFrontendFiles(contractAddress, contractName) {
    const contractsDir = path.join(__dirname, "/../../frontend/src/contracts");

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir, { recursive: true });
    }

    const contractArtifact = artifacts.readArtifactSync(contractName);

    fs.writeFileSync(
        path.join(contractsDir, contractName + ".json"),
        JSON.stringify(contractArtifact, null, 2)
    );

    // Save address map
    const addressFile = path.join(contractsDir, "contract-address.json");
    let addresses = {};
    if (fs.existsSync(addressFile)) {
        addresses = JSON.parse(fs.readFileSync(addressFile));
    }
    addresses[contractName] = contractAddress;

    fs.writeFileSync(
        addressFile,
        JSON.stringify(addresses, undefined, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
