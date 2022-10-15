//SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.0.0 <0.9.0;

contract Inbox {
    string private message;

    constructor(string memory str) {
        message = str;
    }

    function setMessage(string memory str) public {
        message = str;
    }

    function getMessage() public view returns (string memory) {
        return message;
    }
}
