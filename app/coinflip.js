// import the Anchor library
// @ts-ignore
const anchor = require('@project-serum/anchor');
// Read the generated IDL
const idl = require('../target/idl/lock.json')


const { SystemProgram } = anchor.web3; // Added to initialize account
const fs = require('fs');
var path = require('path');

const opts = {
    preflightCommitment: 'recent',
    commitment: 'recent'
};

const PROGRAM_ID = "2noHXWjYt9apyS3S3LsEDRiymHZqrdWRA2XKq8GCF6Hq";

class AnchorClient {
    // you can make an anchor program without a provider
    // then set the provider later with anchor.setProvider
    // you just won't be able to init or makePost until a wallet provider is set up
    constructor(programId) {
        this.programId = programId;
        this.connection = new anchor.web3.Connection("http://127.0.0.1:8899", 'confirmed');
        const wallet = new anchor.Wallet(keypair)
        // maps anchor calls to Phantom direction
        this.provider = new anchor.Provider(this.connection, wallet, opts);
        this.program = new anchor.Program(idl, this.programId, this.provider);
    }

    async initialize( ) {
        const [treasuryPda, bump] = await anchor.web3.PublicKey.findProgramAddress(
            [this.provider.wallet.publicKey.toBuffer()],
            this.program.programId
        )		//const utf8encoded = Buffer.from(bio);
        // Execute the RPC call
        console.log(treasuryPda)
        const tx = await this.program.rpc.initialize(
            bump,
            //new BN(anchor.web3.LAMPORTS_PER_SOL),
            {
                accounts: {
                    treasury: treasuryPda, // publickey for our new account
                    owner: this.provider.wallet.publicKey, // publickey of our anchor wallet provider
                    systemProgram: SystemProgram.programId // just for Anchor reference
                },
            });

        console.log(
            `Successfully intialized lock ID: ${lock_account} for user ${this.provider.wallet.publicKey}`
        );
        return treasuryPda;
    }

    async payin( lock_account_pda) {
        const tx = await this.program.rpc.payin(
            new BN(anchor.web3.LAMPORTS_PER_SOL),
            {
                accounts: {
                    lockAccount: lock_account_pda, // publickey for our new account
                    owner: this.provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId // just for Anchor reference
                },
                signers: [this.provider.wallet.keypair]// acc must sign this Tx, to prove we have the private key too
            });
        console.log(
            `Successfully payed in lock ID: ${lock_account_pda}`
        );
    }
}

var args = process.argv.slice(2);
keypair_file_owner = args[1]
keypair_file_authority= args[2]
/*

const owner_secretKey = Uint8Array.from(require(keypair_file_owner));
const owner_keypair = anchor.web3.Keypair.fromSecretKey(owner_secretKey);
const authority_secretKey = Uint8Array.from(require(keypair_file_authority));
const authority_keypair = anchor.web3.Keypair.fromSecretKey(authority_secretKey);
*/

client = new AnchorClient(PROGRAM_ID)

if (args[0] === "initialize") {
    (async () => {
        account = await client.initialize()
    })()
}
else if (args[0] === "unlock") {
    lock_pubkey = args[3]
    client.flip(lock_pubkey)
}