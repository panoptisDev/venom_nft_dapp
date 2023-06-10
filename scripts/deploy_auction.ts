import { Address, getRandomNonce, WalletTypes } from "locklift";

// you can pass this parameter by cli or get them by some file reading for example or calculate an address with locklift.provider.getExpectedAddress()
// we just hardcode it here
const TOKEN_ROOT_ADDRESS = new Address("0:e0503cdd6dfc9a3203b2745d2636022d94b2f11da10d3c5550c25a00bd85ee34")

async function main() {
    const signer = (await locklift.keystore.getSigner("0"))!;
    console.log(signer)
    // creating new account for Collection calling (or you can get already deployed by locklift.factory.accounts.addExistingAccount)
    const someAccount = await locklift.factory.accounts.addExistingAccount({
        type: WalletTypes.WalletV3,
        publicKey: signer.publicKey
    });
    const { contract: sample, tx } = await locklift.factory.deployContract({
        contract: "Auction",
        publicKey: signer.publicKey,
        initParams: {
            _owner: someAccount.address,
            _nonce: getRandomNonce()
        },
        constructorParams: {
            tokenRoot: TOKEN_ROOT_ADDRESS,
            sendRemainingGasTo: someAccount.address
        },
        value: locklift.utils.toNano(2),
    });
  
    console.log(`Auction deployed at: ${sample.address.toString()}`);
}
  
main()
    .then(() => process.exit(0))
    .catch(e => {
        console.log(e);
        process.exit(1);
    });