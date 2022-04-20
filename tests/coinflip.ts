import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Coinflip } from "../target/types/coinflip";
import { PublicKey } from '@solana/web3.js';

describe("coinflip", () => {
    // Configure the client to use the local cluster.
    const provider = anchor.Provider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.Coinflip as Program<Coinflip>;

    it('Sets and changes name!', async () => {
        const [treasuryPDA, _] = await PublicKey.findProgramAddress(
            [
                anchor.utils.bytes.utf8.encode("treasury"),
                provider.wallet.publicKey.toBuffer()
            ],
            program.programId
        );

        await program.methods
            .initialize()
            .accounts({
                user: provider.wallet.publicKey,
                treasury: treasuryPDA,
            })
            .rpc();
    });
});