//SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.0 .0 <0.9.0;

contract Campaign {
	struct RequestDetails {
		bool done;
		string desc;
		uint256 value;
		address target;
		uint256 voteCount;
	}

	struct Request {
		RequestDetails details;
		mapping(address => bool) vote;
	}

	address private manager;
	uint256 private minContrib;
	uint256 private contribCount;
	mapping(address => bool) private contribList;
	mapping(uint32 => Request) private requests;
	uint32[] private requestList;
	uint32 internal offset;

	modifier isManager() {
		require(msg.sender == manager, "Manager required");
		_;
	}

	modifier isContributor() {
		require(contribList[msg.sender], "Contributor required");
		_;
	}

	constructor(uint256 minAmount, address newManager) {
		manager = newManager;
		minContrib = minAmount;
	}

	function getManager() public view returns (address) {
		return manager;
	}

	function getMinContrib() public view returns (uint256) {
		return minContrib;
	}

	function getContribStatus() public view returns (bool) {
		return contribList[msg.sender];
	}

	function getRequest(uint32 index) public view returns (RequestDetails memory) {
		RequestDetails memory newRequest = requests[index].details;
		return (newRequest);
	}

	function getRequestList() public view returns (uint32[] memory) {
		return requestList;
	}

	function contribute() public payable {
		require(msg.value > minContrib, "");
		contribList[msg.sender] = true;
		contribCount++;
	}

	function createRequest(
		string memory reqDesc,
		uint256 reqValue,
		address reqTarget
	) public isManager {
		uint32 index = uint32(msg.sig) + offset++;
		requestList.push(index);

		Request storage newRequest = requests[index];
		newRequest.details = RequestDetails(false, reqDesc, reqValue, reqTarget, 0);
	}

	function approveRequest(uint32 index) public isContributor {
		Request storage request = requests[index];
		require(!request.vote[msg.sender], "Voted already");

		request.vote[msg.sender] = true;
		request.details.voteCount++;
	}

	function finalizeRequest(uint32 index) public isManager {
		RequestDetails storage details = requests[index].details;
		require(!details.done, "Done already");
		require(details.voteCount > contribCount / 2, "<50% vote");

		payable(details.target).transfer(details.value);
		details.done = true;
	}
}
