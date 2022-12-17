// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

contract RebaseBadge is
    AccessControlUpgradeable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable,
    ERC1155BurnableUpgradeable
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    string private baseURI;
    mapping(uint256 => string) private tokenURIs;
    string public name;

    function initialize(
        string memory _name,
        string memory _baseURI
    ) public virtual initializer {
        __Ownable_init();
        __ERC1155Burnable_init();

        baseURI = _baseURI;
        name = _name;

        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
    }

    function uri(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        return tokenURIs[tokenId];
    }

    function setURI(
        uint256 tokenId,
        string memory tokenURI
    ) external onlyOwner {
        tokenURIs[tokenId] = tokenURI;
        emit URI(uri(tokenId), tokenId);
    }

    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    function setName(string memory _name) external onlyOwner {
        name = _name;
    }

    function mint(
        address to,
        uint256 id,
        bytes memory data
    ) external virtual nonReentrant {
        require(
            hasRole(MINTER_ROLE, _msgSender()),
            "must have minter role to mint"
        );

        _mint(to, id, 1, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        bytes memory data
    ) public virtual nonReentrant {
        require(
            hasRole(MINTER_ROLE, _msgSender()),
            "must have minter role to mint"
        );

        require(to != address(0), "RebaseBadge: mint to the zero address");

        for (uint256 i = 0; i < ids.length; i++) {
            _mint(to, ids[i], 1, data);
        }
    }

    function mintBatchAddresses(
        address[] memory tos,
        uint256[] memory ids,
        bytes memory data
    ) public virtual nonReentrant {
        require(
            hasRole(MINTER_ROLE, _msgSender()),
            "must have minter role to mint"
        );
        for (uint256 i = 0; i < ids.length; i++) {
            _mint(tos[i], ids[i], 1, data);
        }
    }

    function mintAddresses(
        address[] memory tos,
        uint256 id,
        bytes memory data
    ) public virtual nonReentrant {
        require(
            hasRole(MINTER_ROLE, _msgSender()),
            "must have minter role to mint"
        );
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
