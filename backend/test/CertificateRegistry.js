const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateRegistry", function () {
    async function deployCertificateRegistryFixture() {
        const [owner, otherAccount] = await ethers.getSigners();
        const CertificateRegistry = await ethers.getContractFactory("CertificateRegistry");
        const certificateRegistry = await CertificateRegistry.deploy();
        return { certificateRegistry, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { certificateRegistry, owner } = await loadFixture(deployCertificateRegistryFixture);
            const DEFAULT_ADMIN_ROLE = await certificateRegistry.DEFAULT_ADMIN_ROLE();
            expect(await certificateRegistry.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.equal(true);
        });

        it("Should grant ISSUER_ROLE to owner", async function () {
            const { certificateRegistry, owner } = await loadFixture(deployCertificateRegistryFixture);
            const ISSUER_ROLE = await certificateRegistry.ISSUER_ROLE();
            expect(await certificateRegistry.hasRole(ISSUER_ROLE, owner.address)).to.equal(true);
        });
    });

    describe("Issuance", function () {
        it("Should allow valid issuer to issue certificate", async function () {
            const { certificateRegistry } = await loadFixture(deployCertificateRegistryFixture);
            await expect(certificateRegistry.issueCertificate("1", "Alice", "Blockchain 101", "2023-10-27"))
                .to.emit(certificateRegistry, "CertificateIssued")
                .withArgs("1", "Alice", "Blockchain 101", await certificateRegistry.runner.address);
        });

        it("Should fail if unauthorized user tries to issue", async function () {
            const { certificateRegistry, otherAccount } = await loadFixture(deployCertificateRegistryFixture);
            const ISSUER_ROLE = await certificateRegistry.ISSUER_ROLE();
            await expect(certificateRegistry.connect(otherAccount).issueCertificate("1", "Bob", "DeFi", "2023-10-28"))
                .to.be.revertedWithCustomError(certificateRegistry, "AccessControlUnauthorizedAccount")
                .withArgs(otherAccount.address, ISSUER_ROLE);
        });

        it("Should fail if certificate ID already exists", async function () {
            const { certificateRegistry } = await loadFixture(deployCertificateRegistryFixture);
            await certificateRegistry.issueCertificate("1", "Alice", "Blockchain 101", "2023-10-27");
            await expect(certificateRegistry.issueCertificate("1", "Bob", "DeFi", "2023-10-28"))
                .to.be.revertedWith("Certificate with this ID already exists");
        });
    });

    describe("Verification", function () {
        it("Should return correct certificate details", async function () {
            const { certificateRegistry } = await loadFixture(deployCertificateRegistryFixture);
            await certificateRegistry.issueCertificate("123", "Charlie", "Solidity Masterclass", "2024-01-01");

            const cert = await certificateRegistry.verifyCertificate("123");
            expect(cert.name).to.equal("Charlie");
            expect(cert.course).to.equal("Solidity Masterclass");
            expect(cert.isValid).to.equal(true);
        });

        it("Should revert if certificate does not exist", async function () {
            const { certificateRegistry } = await loadFixture(deployCertificateRegistryFixture);
            await expect(certificateRegistry.verifyCertificate("999"))
                .to.be.revertedWith("Certificate not found or invalid");
        });
    });
});
