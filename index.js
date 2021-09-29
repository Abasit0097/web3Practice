//step-1 reading balance of account*************************

const Web3 = require('web3');
const rpcURL = 'https://ropsten.infura.io/v3/39f4588fa9b14c9ab5888675d3d58d43';

const web3 = new Web3(rpcURL);

const address = "0x679083d5cB256f43826f4b1Dc7dE84Fc8C575328";

web3.eth.getBalance(address, (err, wei) => {
console.log("balance in wei", wei);
balance = web3.utils.fromWei(wei, 'ether');
console.log("balance in ether", balance);

})

//step-2 reading contract*************************************

const ABI = [
	{
		"inputs": [],
		"name": "read",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "b",
				"type": "uint256"
			}
		],
		"name": "write",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

contractAddress = "0xa6cfB06a01B7aF9584a9Eac13cdDe624928e1ffC";

const contract = new web3.eth.Contract(ABI, contractAddress);

contract.methods.read().call((err, result)=>{
    if(!err) {
        console.log("result of read is", result);
    }
})

//step-3 making value transfer***********************************

require("dotenv").config();
const Tx = require('ethereumjs-tx').Transaction;
const account1 = "0x679083d5cB256f43826f4b1Dc7dE84Fc8C575328"; //2.36
const account2 = "0x4fa3D5b91fCF8bCDe7933FBb5F0295cC5812f74c"; // 2.09

const abc = process.env["Pvtkey"];
const privateKey = Buffer.from(abc, 'hex');

web3.eth.getTransactionCount(account1, (err, txCount)=>{
    const txObject = {
        nonce: web3.utils.toHex(txCount),
        to: account2,
        value: web3.utils.toHex(web3.utils.toWei('0.1', 'ether')),
        gasLimit: web3.utils.toHex(21000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
    }

    const tx = new Tx(txObject, {'chain':'ropsten'});
    tx.sign(privateKey);

    const serializedTx = tx.serialize();
    const raw = '0x' + serializedTx.toString('hex');

    web3.eth.sendSignedTransaction(raw, (err, trxHash) => {
        if(!err) {
            console.log("Transaction Hash is", trxHash);
        }
    })
});

//step-4 deploying contract (started from office pc so new Tx, web 3 and infura url etc)**************************

var Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');
const web3 = new Web3('https://ropsten.infura.io/v3/39f4588fa9b14c9ab5888675d3d58d43');

const account1 = '0x679083d5cB256f43826f4b1Dc7dE84Fc8C575328';
const privateKey1 = Buffer.from('ac416838cabab81a0032ee5351aa600ec2c39e33a9aa17b496b8b0642cfed05f', "hex");

const byteCode = Buffer.from("0x608060405234801561001057600080fd5b5061012f806100206000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c8063967e6e65146037578063d5dcf127146051575b600080fd5b603d6069565b6040516048919060c2565b60405180910390f35b6067600480360381019060639190608f565b6072565b005b60008054905090565b8060008190555050565b60008135905060898160e5565b92915050565b60006020828403121560a057600080fd5b600060ac84828501607c565b91505092915050565b60bc8160db565b82525050565b600060208201905060d5600083018460b5565b92915050565b6000819050919050565b60ec8160db565b811460f657600080fd5b5056fea2646970667358221220a7112f184bdeb5394ca49f19aed57997972d244f41492354606ac1a82df39dd564736f6c63430008000033", "hex");


const contractDeploy = async () => {
	try {
		let txCount = await web3.eth.getTransactionCount(account1);
		const txObject = {
			nonce: web3.utils.toHex(txCount),
			data: byteCode,
			gasLimit: web3.utils.toHex(1000000), // Raise the gas limit to a much higher amount
			gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
		};

		const tx = new Tx(txObject, { 'chain': 'ropsten', hardfork: 'petersburg' });
		tx.sign(privateKey1);

		const serialized = tx.serialize();
		const raw = '0x' + serialized.toString('hex');

		const signedTransaction = await web3.eth.sendSignedTransaction(raw);
		console.log("signed transaction = ", signedTransaction);

	}
	catch (error) {
		console.log('error', error);
	}
}

contractDeploy(); //contract address is 0x5E35FFD6d557a661454Bc8E9411182b6A07B1077

//step-5 Calling smart contract functions**************************************************************************************

const contractAddress1 = '0x3dD00ee3D96fD3E71E2Df164b5313880e198F87b'; // new contract instance deployed to check updating contract functions
const contractABI1 = [
	{
		"inputs": [],
		"name": "getAge",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "a",
				"type": "uint256"
			}
		],
		"name": "setAge",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const contract1 = new web3.eth.Contract(contractABI1, contractAddress1);

const contractWrite = async () => {
	try {
		const txCount = await web3.eth.getTransactionCount(account1);
		const txObject = {
			nonce: web3.utils.toHex(txCount),
			gasLimit: web3.utils.toHex(1000000),
			gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
			to: contractAddress1,
			data: contract1.methods.setAge(32).encodeABI()
		};

		const tx = new Tx(txObject, { 'chain': 'ropsten', hardfork: 'petersburg' });
		tx.sign(privateKey1);

		const serialized = tx.serialize();
		const raw = '0x' + serialized.toString('hex');

		const signedTransaction = await web3.eth.sendSignedTransaction(raw);
		console.log("signed transaction = ", signedTransaction);

	}
	catch (error) {
		console.log("error=", error);

	}
}

contractWrite();

//Step - 6 Calling of Events************************************************************************************


const contractAddress2 = '0x2a76DbA1ECd207397205fb5CfBa0f860bBd27050' //new contract deployed with events to call events
const contractABI2 = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "ageStatus",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getAge",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "a",
				"type": "uint256"
			}
		],
		"name": "setAge",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const contract2 = new web3.eth.Contract(contractABI2, contractAddress2);

const getevents = async() => {
	try{
		const eventDetails = await contract2.getPastEvents("ageStatus", {
			fromBlock: 11115396,
			to: "latest"
		});

		console.log("event logs are", eventDetails);

	}
	catch(error) {
		console.log("error", error);
	}
}

getevents();

//Step - 7 Inspecting blocks*********************************************************************************************

// get block number

const blockNumber = async() => {
	const block = await web3.eth.getBlockNumber()
	console.log("Number = ", block);
}

blockNumber();

// get latest block number

const latestBlock = async() => {
	const info = await web3.eth.getBlock("latest")
	console.log("info =",info)
}

latestBlock();

//getting info of last two blocks

const latest2Block = async() => {
const number2blocks =await web3.eth.getBlockNumber();
	for ( i = 0; i <2; i++){
		const info2blocks = await web3.eth.getBlock(number2blocks-i)
		console.log("info is ", info2blocks);	
	}
}
latest2Block();

// Step -8 web3.js utils*************************************************************************************************************


//checking gas price
const gasprice = async() => { 
	const price = await web3.eth.getGasPrice();
	console.log("ether price =",web3.utils.fromWei(price, 'ether'));
}

gasprice();

//converting to keccak256
console.log("kecckak256 =",web3.utils.keccak256('Thanks Piaic'));

//converting to random hex
console.log("hex = ",web3.utils.randomHex(45));

