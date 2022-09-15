//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "base64-sol/base64.sol";

contract DynamicSvgNft is ERC721, Ownable {
  // mint
  // store our SVG information somewhere

  uint256 private s_tokenCounter;
  string private i_lowImageURI;
  string private i_highImageURI;
  string private constant base64EncodedSvgPrefix = "data:image/svg+xml;base64,";

  constructor(string memory lowSvg, string memory highSvg) ERC721("Dynamic SVG NFT", "DSM") {
    s_tokenCounter = 0;
    i_lowImageURI = "";
    i_highImageURI = "";
  }

  function svgToImageURI(string memory svg) public pure returns (string memory) {
    string memory svgBase64Encoded = Base64.encode(bytes(string(abi.encodePacked(svg))));
    return string(abi.encodePacked(base64EncodedSvgPrefix, svgBase64Encoded));
  }

  function mintNft() public {
    _safeMint(msg.sender, s_tokenCounter);
    s_tokenCounter++;
  }

  function _baseURI() internal pure override returns (string memory) {
    return "data:application/json;base64,";
  }

  // override erc721 tokenURI function
  // need it to return base64 of metadata json
  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    require(_exists(tokenId), "URI Query for nonexistent token");
    string memory imageURI = "hi";

    //data:image/svg+xml;base64 prefix for svg images
    //data:application/json;base64 prefix for json

    // creating json string, encoding in bytes->base64->append inital part
    return
      string(
        abi.encodePacked(
          _baseURI(),
          Base64.encode(
            bytes(
              abi.encodePacked(
                '{"name":"',
                name(),
                '", "description": "An NFT that changes based on the Chainlink Feed",',
                '"attributes": [{"trait_type":"coolness", "value":199}], "image":"',
                imageURI
              )
            )
          )
        )
      );
  }
}
