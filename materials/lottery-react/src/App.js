import React, { useEffect, useReducer } from "react";
import lottery from "./lottery";
import web3 from "./web3";

const stateReducer = (state, action) => ({ ...state, ...(typeof action === "function" ? action(state) : action) });

function App() {
	const [state, setState] = useReducer(stateReducer, {
		manager: "",
		players: "",
		balance: "",
		value: "",
		message: "",
	});

	const fetchContract = async () => {
		setState({
			manager: await lottery.methods.getManager().call(),
			players: await lottery.methods.getPlayersNumber().call(),
			balance: await web3.eth.getBalance(lottery.options.address),
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const accounts = await web3.eth.getAccounts();

		setState({ message: "Waiting on transaction" });
		await lottery.methods.enterLottery().send({ from: accounts[0], value: web3.utils.toWei(state.value, "ether") });

		setState({ message: "Done on transaction" });
		await fetchContract();
	};

	const handleButton = async () => {
		const accounts = await web3.eth.getAccounts();

		setState({ message: "Waiting on transaction" });
		await lottery.methods.pickWinner().send({ from: accounts[0] });

		setState({ message: "Done on transaction" });
		await fetchContract();
	};

	useEffect(() => {
		fetchContract();
	}, []);

	return (
		<div>
			<h2>Lottery Contract</h2>
			<p>getManager {state.manager}</p>
			<p>getPlayers {state.players}</p>
			<p>getBalance {web3.utils.fromWei(state.balance, "ether")}</p>
			<hr />

			<form onSubmit={handleSubmit}>
				<h4>Enter the lottery</h4>
				<div>
					<label>Amount of ether </label>
					<input value={state.value} onChange={(event) => setState({ value: event.target.value })} />
				</div>
				<button>Enter</button>
			</form>
			<hr />

			<h4>Pick a winner</h4>
			<button onClick={handleButton}>Enter</button>
			<hr />

			<h2>{state.message}</h2>
			<hr />
		</div>
	);
}

export default App;
