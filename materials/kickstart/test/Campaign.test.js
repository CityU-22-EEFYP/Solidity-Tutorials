import * as assert from "assert";
import ganache from "ganache-cli";
import Web3 from "web3";
import mocha from "mocha";
import jCamp from "../ethereum/build/Campaign.json" assert { type: "json" };
import jCampFact from "../ethereum/build/CampaignFactory.json" assert { type: "json" };

const web3 = new Web3(ganache.provider());

let accounts;
let factory;
let camAddress;
let camp;

mocha.beforeEach(async () => {
	accounts = await web3.eth.getAccounts();

	factory = await new web3.eth.Contract(jCampFact.abi)
		.deploy({ data: jCampFact.evm.bytecode.object })
		.send({ from: accounts[0], gas: "5000000" });

	await factory.methods.createCamp("100").send({ from: accounts[0], gas: "5000000" });
	[camAddress] = await factory.methods.getDeployedCamp().call();
	camp = await new web3.eth.Contract(jCamp.abi, camAddress);
});

mocha.describe("Deploys", () => {
	mocha.it("Deployed Factory", () => {
		assert.ok(factory.options.address);
	});

	mocha.it("Deployed Campaign", () => {
		assert.ok(camp.options.address);
	});
});

mocha.describe("Test", () => {
	mocha.it("Caller as manager", async () => {
		const manager = await camp.methods.getManager().call();
		assert.equal(accounts[0], manager);
	});

	mocha.it("Contribute Campaign and Contributor", async () => {
		await camp.methods.contribute().send({
			from: accounts[1],
			value: "200",
		});

		const isContributor = await camp.methods.getContribStatus().call({ from: accounts[1] });
		assert.ok(isContributor);
	});

	mocha.it("Min Contribution", async () => {
		try {
			await camp.methods.contribute().send({
				from: accounts[1],
				value: "5",
			});
		} catch (err) {
			const revertError = "VM Exception while processing transaction: revert";
			assert.equal(err.message, revertError);
		}
	});

	mocha.it("Create Request", async () => {
		await camp.methods.createRequest("Task Name", "100", accounts[1]).send({ from: accounts[0], gas: "1000000" });

		const reqList = await camp.methods.getRequestList().call();
		const req = await camp.methods.getRequest(reqList[0]).call();

		assert.equal(req.desc, "Task Name");
		assert.equal(req.value, "100");
		assert.equal(req.target, accounts[1]);
	});

	mocha.it("Process Request", async () => {
		await camp.methods.contribute().send({
			from: accounts[0],
			value: Web3.utils.toWei("10", "ether"),
		});

		await camp.methods
			.createRequest("Task Name", Web3.utils.toWei("5", "ether"), accounts[5])
			.send({ from: accounts[0], gas: "1000000" });

		const reqList = await camp.methods.getRequestList().call();
		await camp.methods.approveRequest(reqList[0]).send({ from: accounts[0], gas: "1000000" });
		await camp.methods.finalizeRequest(reqList[0]).send({ from: accounts[0], gas: "1000000" });

		const balance = parseFloat(Web3.utils.fromWei(await web3.eth.getBalance(accounts[5]), "ether"));
		assert.equal(balance, 105);
	});
});
