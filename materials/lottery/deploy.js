// deploy code will go here
import dotenv from "dotenv";
import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import compiled from "./compile.js";

dotenv.config();

const provider = new HDWalletProvider(process.env.ACmnemonic, process.env.NetworkUrl);
const web3 = new Web3(provider);

const accounts = await web3.eth.getAccounts();

console.log("Deploy from: ", accounts[0]);

const lottery = await new web3.eth.Contract(compiled.abi)
	.deploy({ data: compiled.evm.bytecode.object })
	.send({ gas: "1000000", from: accounts[0] });

console.log("Deployed to: ", lottery.options.address);
provider.engine.stop();
