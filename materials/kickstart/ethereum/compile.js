import fs from "fs";
import path from "path";
import solc from "solc";

const __dirname = path.resolve();
const inPath = path.resolve(__dirname, "contracts");
const outPath = path.resolve(__dirname, "build");

const sources = {};

fs.rmSync(outPath, { recursive: true, force: true });
fs.mkdirSync(outPath);

const paths = fs.readdirSync(inPath).filter((str) => str.includes(".sol"));
paths.forEach((file) => (sources[file] = { content: fs.readFileSync(path.resolve(inPath, file), "utf-8") }));

const input = {
	language: "Solidity",
	sources: sources,
	settings: { outputSelection: { "*": { "*": ["*"] } } },
};

const compiled = JSON.parse(solc.compile(JSON.stringify(input))).contracts;
paths.forEach((file) =>
	fs.writeFileSync(
		path.resolve(outPath, path.parse(file).name.concat(".json")),
		JSON.stringify(compiled[file][path.parse(file).name])
	)
);
