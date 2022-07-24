const EC=require('elliptic').ec; 
const ec=new EC('secp256k1');
const key =ec.genKeyPair();
const publicKey=key.getPublic('hex');
const privateKey=key.getPrivate('hex');
console.log();
console.log('Private Key:',privateKey);

console.log();
console.log('Public Key:',publicKey);

//# 2nd Wallet
/*
const publicKey2=key.getPublic('hex');
const privateKey2=key.getPrivate('hex');
console.log();
console.log('Private Key Of 2nd Wallet:',privateKey2);

console.log();
console.log('Public Key Of 2nd Wallet:',publicKey2);

*/