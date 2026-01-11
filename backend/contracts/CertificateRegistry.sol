// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract CertificateRegistry is AccessControl {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    struct Certificate {
        string name;
        string course;
        string date;
        address issuer;
        bool isValid;
    }

    // Mapping from unique Certificate ID (string) to Certificate data
    mapping(string => Certificate) public certificates;

    event CertificateIssued(string indexed id, string name, string course, address indexed issuer);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ISSUER_ROLE, msg.sender);
    }

    /**
     * @dev Issues a new certificate. Only users with ISSUER_ROLE can call this.
     * @param _id Unique identifier for the certificate (e.g., UUID or hash)
     * @param _name Name of the recipient
     * @param _course Name of the course or achievement
     * @param _date Date of issuance
     */
    function issueCertificate(
        string memory _id,
        string memory _name,
        string memory _course,
        string memory _date
    ) public onlyRole(ISSUER_ROLE) {
        require(bytes(_id).length > 0, "ID cannot be empty");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_course).length > 0, "Course cannot be empty");
        require(bytes(_date).length > 0, "Date cannot be empty");
        require(!certificates[_id].isValid, "Certificate with this ID already exists");

        certificates[_id] = Certificate({
            name: _name,
            course: _course,
            date: _date,
            issuer: msg.sender,
            isValid: true
        });

        emit CertificateIssued(_id, _name, _course, msg.sender);
    }

    /**
     * @dev Verifies a certificate by its ID.
     * @param _id Unique identifier for the certificate
     */
    function verifyCertificate(string memory _id) public view returns (string memory name, string memory course, string memory date, address issuer, bool isValid) {
        Certificate memory cert = certificates[_id];
        require(cert.isValid, "Certificate not found or invalid");
        return (cert.name, cert.course, cert.date, cert.issuer, cert.isValid);
    }
}
