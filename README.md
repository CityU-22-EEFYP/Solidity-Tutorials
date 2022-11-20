# Tutorials and notes for solidity

## VS code setting

### Extentions

-   RemixProject.ethereum-remix
-   JuanBlanco.solidity
-   esbenp.prettier-vscode
-   (optional) trufflesuite-csi.truffle-vscode

---

### Solidity-tutorials/materials/../.vscode/settings.json

```json
{
	"editor.formatOnSave": true,
	"editor.defaultFormatter": "esbenp.prettier-vscode",
	"solidity.formatter": "prettier",
	"solidity.defaultCompiler": "remote",
	"solidity.compileUsingRemoteVersion": "latest",
	"solidity.enabledAsYouTypeCompilationErrorCheck": true,
	"solidity.validationDelay": 1500
}
```

### Solidity-tutorials/materials/../.env

```txt
ACmnemonic="those twelve random words here"
NetworkUrl="https://goerli.infura.io/v3/$someRandomHash"
```

---

## NVM package locally

```bash
# cd ...Solidity-tutorials/materials/../
npm i
```

## NVM package globally

```bash
npm i -g truffle
npm i -g ganache
```

---

## Ganache Tips

### run ganache

ganache

### usful flags

-   -v Set to true to log detailed RPC requests.
-   -h Hostname to listen on. default 127.0.0.1
-   -p Port to listen on. default 8545
-   -m Use a specific HD wallet mnemonic to generate initial addresses.
-   -e The default account balance in ether. default 1000 ether

### Host on all interface at port 3005 with logs

ganache -v -h 0.0.0.0 -p 3005 -m "those twelve random words here"
