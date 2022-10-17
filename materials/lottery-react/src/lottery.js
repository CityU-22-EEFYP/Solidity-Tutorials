import web3 from "./web3";

const address = "0xdCCC63417B7751a8bE26ae498fEA5f652E0A7aD3";
const abi = [
	{ inputs: [], stateMutability: "nonpayable", type: "constructor" },
	{ inputs: [], name: "enterLottery", outputs: [], stateMutability: "payable", type: "function" },
	{
		inputs: [],
		name: "getManager",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "getPlayers",
		outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint64", name: "index", type: "uint64" }],
		name: "getPlayersByIndex",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "getPlayersNumber",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{ inputs: [], name: "pickWinner", outputs: [], stateMutability: "nonpayable", type: "function" },
];

export default new web3.eth.Contract(abi, address);
