//step-1 reading balance of account

const Web3 = require('web3');
const rpcURL = 'https://ropsten.infura.io/v3/39f4588fa9b14c9ab5888675d3d58d43';

const web3 = new Web3(rpcURL);

const address = "0x679083d5cB256f43826f4b1Dc7dE84Fc8C575328";

web3.eth.getBalance(address, (err, wei) => {
console.log("balance in wei", wei);
balance = web3.utils.fromWei(wei, 'ether');
console.log("balance in ether", balance);

})

//step-2 reading contract

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

//step-3 making value transfer

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