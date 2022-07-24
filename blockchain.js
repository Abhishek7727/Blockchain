const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.timestamp = Date.now();
    }
    claculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }
    signTransaction(signingKey) {
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('You Cannot Sign Transaction for other Wallets!');
        }
        const hashTx = this.claculateHash();
        //const sig=signingKey.sig.toDer('hex');
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }
    isValid() {
        if (this.fromAddress === null) return true;
        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this Transaction');
        }
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.claculateHash(), this.signature)
    }


}

class Block {
    constructor(timestamp, transaction, previouHash = '') {
        this.timestamp = timestamp;
        this.transaction = transaction;
        this.previouHash = previouHash;
        this.hash = this.claculateHash();
        this.nonce = 0;
    }
    claculateHash() {
        return SHA256(this.index + this.previouHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.claculateHash();
        }
        console.log("THIS BLOCK IS MINED:" + this.hash);
    }
    hasValidTransaction() {
        for (const tx of this.transaction) {
            if (!tx.isValid()) {
                return false;
            }
        }
        return true;
    }


}
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransactions = [];
        this.miningReward = 200;
    }
    createGenesisBlock() {
        return new Block("01/01/2022", "Genesis Block", "000");
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    /*addBlock(newBlock)
    {
        newBlock.previouHash=this.getLatestBlock().hash;
        //newBlock.hash=newBlock.claculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }*/
    minePendingTransaction(miningRewardAddress) {
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);

        let block = new Block(Date.now(), this.pendingTransactions);
        
        block.previouHash=this.getLatestBlock().hash;
        block.mineBlock(this.difficulty);



        console.log("******BLOCK SUCCESSFULLY MINED****** ");
        console.log('MINED REWARD:', this.miningReward);
        this.chain.push(block);

        this.pendingTransactions = [];

    }
    addTransaction(transaction) {
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction Must Include From And To Address');
        }
        if (!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction to chain');
        }
        this.pendingTransactions.push(transaction);

        if (transaction.amount <= 0) {
            throw new Error('Transaction amount should be higher than 0');
        }

        // Making sure that the amount sent is not greater than existing balance
      /*  const walletBalance = this.getBalanceOfAddress(transaction.fromAddress);
        if (walletBalance < transaction.amount) {
            throw new Error('Not enough balance');
        }*/


    }
    getBalanceOfAddress(address) {
        let bal = 0;
        for (const block of this.chain) {
            for (const trans of block.transaction) {
                if (trans.fromAddress === address) {
                    bal -= trans.amount;
                }

                if (trans.toAddress === address) {
                    bal += trans.amount;
                }
            }

        }
        return bal;

    }
    isChainValid() {
        const realGenesis = JSON.stringify(this.createGenesisBlock());

        if (realGenesis !== JSON.stringify(this.chain[0])) {
            return false;
        }
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if (!currentBlock.hasValidTransaction()) {
                return false;
            }

            if (currentBlock.hash !== currentBlock.claculateHash()) {
                return false;
            }
            if (currentBlock.previouHash !== previousBlock.hash) {
                return false;
            }

        }
        return true;
    }
}
module.exports.Blockchain = Blockchain;
module.exports.Block = Block;
module.exports.Transaction = Transaction;