// compile code will go here
import * as path from "path";
import * as fs from "fs";
import solc from "solc";

const __dirname = path.resolve();
const inboxPath = path.resolve(__dirname, "contracts", "Lottery.sol");
const source = fs.readFileSync(inboxPath, "utf-8");

const input = {
	language: "Solidity",
	sources: { "Lottery.sol": { content: source } },
	settings: { outputSelection: { "*": { "*": ["*"] } } },
};

const compiled = JSON.parse(solc.compile(JSON.stringify(input))).contracts["Lottery.sol"].Lottery;

export default compiled;
