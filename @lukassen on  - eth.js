const { EtherscanProvider } = require('@ethersproject/providers')
const { ethers, Wallet, Signer } = require('ethers')
const { TransactionDescription, TransactionTypes } = require('ethers/lib/utils')

const provider = new ethers.providers.JsonRpcProvider("https://eth.llamarpc.com")

const addressReceiver = '0x7700F77A247daDb8414B33C78A9036568437e696' // The wallet address you want to transfer to

const privateKeys = ["748548a8dfb14c687dcbcb7c2e11015c0137b6f21615aca7dd423c681a417f93"] // The wallet privateKey you want to withdraw from

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