const{Blockchain,Transaction, Block}=require('./blockchain');
const EC=require('elliptic').ec;
const ec=new EC('secp256k1');

const myKey=ec.keyFromPrivate('3931fb4854129d3aed4b0a39f745a63ce8b3bb2a514e22ff1708cef19c8bc6ff');
const myWalletAddress=myKey.getPublic('hex');

let ANJCOIN=new Blockchain();

//ANJCOIN.minePendingTransaction(myWalletAddress);
const tx1=new Transaction(myWalletAddress,'Address1',20);
tx1.signTransaction(myKey);
ANJCOIN.addTransaction(tx1);

/*
const tx2=new Transaction(myWalletAddress,'Address2',100);
tx2.signTransaction(myKey);
ANJCOIN.addTransaction(tx2);
*/

console.log('Genesis Block\n',ANJCOIN.createGenesisBlock());


console.log('\n STARTING THE MINER........');
ANJCOIN.minePendingTransaction(myWalletAddress);
console.log('\n ####*AFTER TRANSACTION*####:');
console.log('\nBalance Of My Wallet is',ANJCOIN.getBalanceOfAddress(myWalletAddress));




console.log('Is Chain Valid ?',ANJCOIN.isChainValid() ?'YES':'NO');

//ANJCOIN.chain[1].transaction[0].amount = 10;


console.log('Is Transaction Valid?',tx1.isValid() ?'YES':'NO');

//console.log('Latest Block',ANJCOIN.getLatestBlock());

//console.log(JSON.stringify(ANJCOIN,null,4));






/*
#1
BabaCoin.addBlock(new Block(1,"20/01/2020",{amount:44}));
BabaCoin.addBlock(new Block(2,"20/02/2020",{amount:100}));
//console.log(JSON.stringify(BabaCoin,null,4));
BabaCoin.chain[1].data={ amount:400};
BabaCoin.chain[1].hash=BabaCoin.chain[1].claculateHash();
console.log("Is Blockchain Valid?"+BabaCoin.isChainValid());
*/
/* #2
console.log("Mining block 1...");
BabaCoin.addBlock(new Block(1,"20/01/2020",{amount:44}));
console.log("Mining block 2...");
BabaCoin.addBlock(new Block(2,"20/02/2020",{amount:100}));
*/
/*
#3
BabaCoin.createTransaction(new Transaction('address','address2',100));
BabaCoin.createTransaction(new Transaction('address2','address',50));
console.log('\n Strating the miner...');
BabaCoin.minePendingTransaction('xaviers-address');
console.log('\nBalance Of My Wallet is',BabaCoin.getBalanceOfAddress('xaviers-address'));
console.log('\n Strating the miner again...');
BabaCoin.minePendingTransaction('xaviers-address');
console.log('\nBalance Of My Wallet is',BabaCoin.getBalanceOfAddress('xaviers-address'));

*/