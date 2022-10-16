import * as assert from "assert";
import ganache from "ganache-cli";
import Web3 from "web3";
import mocha from "mocha";
import compiled from "../compile.js";

const web3 = new Web3(ganache.provider());

let accounts;
let lottery;

mocha.beforeEach(async () => {
	accounts = await web3.eth.getAccounts();

	lottery = await new web3.eth.Contract(compiled.abi)
		.deploy({ data: compiled.evm.bytecode.object })
		.send({ from: accounts[0], gas: "1000000" });
});

mocha.describe("Inbox", () => {
	mocha.it("deployed", () => {
		assert.ok(lottery.options.address);
	});

	mocha.it("one player entry", async () => {
		await lottery.methods.enterLottery().send({ from: accounts[0], value: web3.utils.toWei("1", "ether") });
		const players = await lottery.methods.getPlayers().call({ from: accounts[0] });

		assert.equal(accounts[0], players[0]);
		assert.equal(1, players.length);
	});

	mocha.it("mutliple players entry", async () => {
		const numPlayer = 5;

		for (let i = 0; i < numPlayer; i++)
			await lottery.methods.enterLottery().send({ from: accounts[i], value: web3.utils.toWei("1", "ether") });
		const players = await lottery.methods.getPlayers().call({ from: accounts[0] });

		assert.deepEqual(accounts.slice(0, numPlayer), players);
		assert.equal(numPlayer, players.length);
	});

	mocha.it("minimum ether test", async () => {
		try {
			await lottery.methods.enterLottery().send({ from: accounts[0], value: 1000 });
			// assert(false);
		} catch (err) {}
	});

	mocha.it("pick winner by not manager", async () => {
		try {
			await lottery.methods.pickWinner().send({ from: accounts[1] });
			// assert(false);
		} catch (err) {}
	});

	mocha.it("send money and reset array", async () => {
		await lottery.methods.enterLottery().send({ from: accounts[0], value: web3.utils.toWei("2", "ether") });
		const iniBalance = await web3.eth.getBalance(accounts[0]);

		await lottery.methods.pickWinner().send({ from: accounts[0] });
		const finBalance = await web3.eth.getBalance(accounts[0]);

		const diff = finBalance - iniBalance;
		assert.ok(diff > web3.utils.toWei("1.8", "ether"));
	});
});
