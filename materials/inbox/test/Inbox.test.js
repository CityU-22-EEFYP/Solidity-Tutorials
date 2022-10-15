// contract test code will go here
import * as assert from "assert";
import ganache from "ganache-cli";
import { beforeEach, describe, it } from "mocha";
import Web3 from "web3";
import compiled from "../compile.js";

const web3 = new Web3(ganache.provider());
const iniMessage = "Test";

let accounts;
let inbox;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    inbox = await new web3.eth.Contract(compiled.abi)
        .deploy({ data: compiled.evm.bytecode.object, arguments: [iniMessage] })
        .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", () => {
    // deploy
    it("deployed", () => {
        assert.ok(inbox.options.address);
    });

    // call()
    it("default message", async () => {
        const message = await inbox.methods.getMessage().call();
        assert.equal(message, iniMessage);
    });

    // send()
    it("update message", async () => {
        const newMessage = "Updates";
        await inbox.methods.setMessage(newMessage).send({ from: accounts[0] });
        const message = await inbox.methods.getMessage().call();
        assert.equal(message, newMessage);
    });
});
