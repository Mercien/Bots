const { EtherscanProvider } = require('@ethersproject/providers')
const { ethers, Wallet, Signer } = require('ethers')
const { TransactionDescription, TransactionTypes } = require('ethers/lib/utils')

const provider = new ethers.providers.JsonRpcProvider("https://eth.llamarpc.com")

const addressReceiver = '0x54C506522B46593fB729Fbf4B2e99Ad27f484C14' // The wallet address you want to transfer to

const privateKeys = ["81b6b75162c6b435600e758f074c69e467cecfe68d593d6b4f0daf3908d8a4cf"] // The wallet privateKey you want to withdraw from

const bot = async =>{
    provider.on('block', async () => {
        console.log('Waiting ;)');
        for (let i = 0; i < privateKeys.length; i++){
            const _target = new ethers.Wallet(privateKeys[i]);
            const target = _target.connect(provider);
            const balance = await provider.getBalance(target.address);

            const gasPrice = provider.getGasPrice()
            const gasLimit = 21000

            const gasFees = (await gasPrice).mul(gasLimit)
            console.log("Total max gasFees is: " + gasFees)

            if (balance.sub(gasFees) > 0){
                console.log("New Account with BNB!");
                const amount = balance.sub(gasFees)
                const nonce = provider.getTransactionCount(target.address)
                try {
                    await target.sendTransaction({
                        to: addressReceiver,
                        value: amount,
                        gasPrice: gasPrice,
                        gasLimit: gasLimit,
                        nonce: nonce
                    });
                    console.log(`Success! transferred -->${ethers.utils.formatEther(balance)}`);
                } catch(e){
                    console.log(`error: ${e}`);
                }
            }
        }
    })
}
bot();