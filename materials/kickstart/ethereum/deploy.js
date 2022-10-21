import dotenv from "dotenv";
import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import jCampFact from "./build/CampaignFactory.json" assert { type: "json" };

dotenv.config();
const provider = new HDWalletProvider(process.env.ACmnemonic, process.env.NetworkUrl);
const web3 = new Web3(provider);

const accounts = await web3.eth.getAccounts();

console.log("Deploy from: ", accounts[0]);

const result = await new web3.eth.Contract(jCampFact.abi)
	.deploy({ data: jCampFact.evm.bytecode.object })
	.send({ gas: "5000000", from: accounts[0] });

console.log("Deployed to: ", result.options.address);
provider.engine.stop();
