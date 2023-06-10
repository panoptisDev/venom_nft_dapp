import { getRandomNonce } from "locklift";

async function main() {
  const signer = (await locklift.keystore.getSigner("0"))!;
  console.log({signer})
  const nftArtifacts = await locklift.factory.getContractArtifacts("Nft");
  const indexArtifacts = await locklift.factory.getContractArtifacts("Index");
  const indexBasisArtifacts = await locklift.factory.getContractArtifacts("IndexBasis");
  const { contract: sample, tx } = await locklift.factory.deployContract({
    contract: "Sample",
    publicKey: signer.publicKey,
    initParams: {
      nounce: getRandomNonce(),
      // owner: new Address(`0:e0503cdd6dfc9a3203b2745d2636022d94b2f11da10d3c5550c25a00bd85ee34`)
      owner: `0x${signer.publicKey}`
    },
    constructorParams: {
        _state: 1,
        codeNft: nftArtifacts.code,
        codeIndex: indexArtifacts.code,
        codeIndexBasis: indexBasisArtifacts.code,
        json: `{
          "type": "Basic NFT",
          "name": "VenomArt Marketplace Collection",
          "description": "Collect your favourite NFTs on venom blockchain, Trade NFTs for free on venomart.",
          "preview": {
            "source": "https://gateway.ipfscdn.io/ipfs/QmeqSSjdVjn3nq968wDDyC4yoHqqLQDPXnS19MShMTEFM6/twitterback.png",
            "mimetype": "image/png"
          },
          "files": [
            {
              "source": "https://gateway.ipfscdn.io/ipfs/QmeqSSjdVjn3nq968wDDyC4yoHqqLQDPXnS19MShMTEFM6/twitterback.png",
              "mimetype": "image/jpg"
            }
          ],
          "external_url": "https://venomart.space/"
        }` // EXAMPLE...not by TIP-4.2
    },
    value: locklift.utils.toNano(1),
  });

  console.log(`Sample deployed at: ${sample.address.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
