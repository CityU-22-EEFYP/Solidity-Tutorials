//SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.0 .0 <0.9.0;

import "./Campaign.sol";

contract CampaignFactory {
	address[] private deployedCamp;

	function createCamp(uint256 minAmount) public {
		address newCampaign = address(new Campaign(minAmount, msg.sender));
		deployedCamp.push(newCampaign);
	}

	function getDeployedCamp() public view returns (address[] memory) {
		return deployedCamp;
	}
}
