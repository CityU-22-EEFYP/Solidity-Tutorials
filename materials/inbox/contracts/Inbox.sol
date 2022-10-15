//SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.0.0 <0.9.0;

// linter warnings (red underline) about pragma version can igonored!

// contract code will go here
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
