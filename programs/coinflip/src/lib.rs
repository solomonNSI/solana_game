use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;
use anchor_lang::solana_program::{clock, program_option::COption, sysvar};
use anchor_lang::solana_program::{
    lamports,
    program::{invoke, invoke_signed},
    system_instruction::{transfer , assign_with_seed, assign}
};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod coinflip {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let treasury = &mut ctx.accounts.treasury;
        treasury.bump = *ctx.bumps.get("treasury").unwrap();
        Ok(())
    }

    pub fn flip(ctx: Context<Flip>, lamports: u64, ) -> Result<()>{

        let treasury = &mut ctx.accounts.treasury;
        let c = clock::Clock::get().unwrap();

        msg!("Withdrawing {}", lamports);

        let transfer_instruction = &transfer(
            &ctx.accounts.signer.to_account_info().key,
            &treasury.to_account_info().key,
            lamports,
        );

        invoke(
            transfer_instruction,
            &[
                ctx.accounts.signer.to_account_info(),
                treasury.to_account_info(),
            ]
        );
        let amount;
        if (c.unix_timestamp % 2) == 0 {
            /*if ctx.accounts.token_vault.amount < ((lamports * 2)/100) {
                msg!("Congratulations, You won! all the remaining reward in the vault");
                amount = ctx.accounts.treasury.;
                let transfer_instruction = &transfer(
                    &treasury.owner,
                    &ctx.accounts.signer.to_account_info().key,
                    lamports,
                );

                invoke_signed(
                    transfer_instruction,
                    &[
                        treasury.to_account_info(),
                        ctx.accounts.signer.to_account_info(),
                        ctx.accounts.system_program.to_account_info()
                    ],
                    &[&[
                        ctx.accounts.signer.to_account_info().key.as_ref(),
                        &[treasury.bump],
                    ]],
                )
            } else {*/
            amount = lamports * 2;
                // Transfer tokens from the vault to user vault.
                let transfer_instruction = &transfer(
                    &treasury.to_account_info().key,
                    &ctx.accounts.signer.to_account_info().key,
                    amount,
                );

                invoke_signed(
                    transfer_instruction,
                    &[
                        treasury.to_account_info(),
                        ctx.accounts.signer.to_account_info(),
                    ],
                    &[&[
                        ctx.accounts.signer.to_account_info().key.as_ref(),
                        &[treasury.bump],
                    ]],
                );

                msg!("Congratulations, You won!");
            //}
        } else {
            msg!("Sorry, You lost!");
        }
        msg!("Paying in {}", lamports);
        Ok(())
    }
}

#[account]
pub struct Treasury{
    // Do i need to add an lamport vault here?
    bump: u8,
}

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 2 + 4 + 200 + 1, seeds = [b"treasury", user.key().as_ref()], bump = bump)]

    #[account(mut)]
    pub user: Signer<'info>,
    // space: 8 discriminator + 2 level + 4 name length + 200 name + 1 bump

    pub treasury: Account<'info, Treasury>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Flip<'info>{
    pub user: Signer<'info>,
    #[account(mut, seeds = [b"treasury", user.key().as_ref()], bump = treasury.bump)]
    pub treasury: Account<'info, Treasury>,
    #[account(mut)]
    pub signer: Signer<'info>,
}