//SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.0 .0 <0.9.0;

contract Lottery {
	address private manager;
	address[] private players;

	constructor() {
		manager = msg.sender;
	}

	function getManager() public view returns (address) {
		return manager;
	}

	function getPlayers() public view restricted returns (address[] memory) {
		return players;
	}

	function getPlayersByIndex(uint64 index) public view restricted returns (address) {
		return players[index];
	}

	function getPlayersNumber() public view returns (uint256) {
		return players.length;
	}

	function enterLottery() public payable {
		require(msg.value > .001 ether, "Not enough ether");

		players.push(msg.sender);
	}

	function random() private view returns (uint256) {
		return uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
	}

	function pickWinner() public restricted {
		uint256 index = random() % players.length;
		payable(players[index]).transfer(address(this).balance);

		players = new address[](0);
	}

	modifier restricted() {
		require(msg.sender == manager, "Not the manager");
		_;
	}
}
