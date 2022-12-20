// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract RebaseBadge is
    Initializable,
    AccessControlUpgradeable,
    ERC1155Upgradeable,
    ERC1155BurnableUpgradeable,
    UUPSUpgradeable
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    string private baseURI;
    mapping(uint256 => string) private tokenURIs;
    string public name;

    constructor() {
        _disableInitializers();
    }

    function initialize(
        string memory _name,
        string memory _baseURI
    ) public virtual initializer {
        __ERC1155_init("");
        __AccessControl_init();
        __ERC1155Burnable_init();
        __UUPSUpgradeable_init();

        baseURI = _baseURI;
        name = _name;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}

    function uri(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        return tokenURIs[tokenId];
    }

    function setURI(
        uint256 tokenId,
        string memory tokenURI
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        tokenURIs[tokenId] = tokenURI;
        emit URI(uri(tokenId), tokenId);
    }

    function setBaseURI(
        string memory _baseURI
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURI = _baseURI;
    }

    function setName(
        string memory _name
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        name = _name;
    }

    function mint(
        address to,
        uint256 id,
        bytes memory data
    ) external onlyRole(MINTER_ROLE) {
        _mint(to, id, 1, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        bytes memory data
    ) external onlyRole(MINTER_ROLE) {
        require(to != address(0), "RebaseBadge: mint to the zero address");

        for (uint256 i = 0; i < ids.length; i++) {
            _mint(to, ids[i], 1, data);
        }
    }

    function mintBatchAddresses(
        address[] memory tos,
        uint256[] memory ids,
        bytes memory data
    ) external onlyRole(MINTER_ROLE) {
        for (uint256 i = 0; i < ids.length; i++) {
            _mint(tos[i], ids[i], 1, data);
        }
    }

    function mintAddresses(
        address[] memory tos,
        uint256 id,
        bytes memory data
    ) external onlyRole(MINTER_ROLE) {
        for (uint256 i = 0; i < tos.length; i++) {
            _mint(tos[i], id, 1, data);
        }
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        virtual
        override(AccessControlUpgradeable, ERC1155Upgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override(ERC1155Upgradeable) {
        require(
            from == address(0) || to == address(0),
            "RebaseBadge: This a Soulbound token. It cannot be transferred. It can only be burned by the token owner."
        );

        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
