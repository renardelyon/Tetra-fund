use std::time::{SystemTime, UNIX_EPOCH};

use candid::Principal;
use ic_ledger_types::{Timestamp, Tokens};
use icrc_ledger_types::{
    icrc1::{
        account::Account,
        transfer::{BlockIndex, NumTokens},
    },
    icrc2::transfer_from::{TransferFromArgs, TransferFromError},
};

use crate::{
    domain::donation::model::{donation::DonationData, transfer_data::TransferArgs},
    DONATION_STATE,
};

use super::usecase::Usecase;

impl Usecase {
    pub async fn donate(&self, receiver: &Principal, amount: Tokens) -> Result<BlockIndex, String> {
        self.save_donation_data(receiver, amount, &ic_cdk::caller())
            .await?;

        ic_cdk::println!("Donation data saved");

        let amount_nat: NumTokens = NumTokens::from(amount.e8s());

        self.transfer_from(TransferArgs {
            amount: amount_nat,
            to_account: Account::from(*receiver),
        })
        .await
    }

    async fn save_donation_data(
        &self,
        receiver: &Principal,
        amount: Tokens,
        donor: &Principal,
    ) -> Result<String, String> {
        DONATION_STATE.with(|state| {
            let mut state = state.borrow_mut();
            let mut donation_list = state.donation_data.get(receiver).unwrap_or_default();

            let now = match SystemTime::now().duration_since(UNIX_EPOCH) {
                Ok(n) => n,
                Err(_) => return Err("Failed to get timestamp".to_string()),
            };

            let new_donation = DonationData {
                amount,
                donor: *donor,
                timestamp: Timestamp {
                    timestamp_nanos: now.as_nanos() as u64,
                },
            };
            donation_list.0.push(new_donation);
            state.donation_data.insert(*receiver, donation_list);
            Ok(format!("{} donate to {}", amount, receiver))
        })
    }

    pub fn get_donation_list_len(&self, receiver: &Principal) -> Result<usize, String> {
        DONATION_STATE.with(|state| {
            let state = state.borrow();
            let len = state.donation_data.get(receiver).map_or(0, |d| d.0.len());
            Ok(len)
        })
    }

    pub fn get_donation_list(&self, receiver: &Principal) -> Result<Vec<DonationData>, String> {
        DONATION_STATE.with(|state| {
            let state = state.borrow();
            let donation_list = state.donation_data.get(receiver).map_or(vec![], |d| d.0);
            Ok(donation_list)
        })
    }

    async fn transfer_from(&self, args: TransferArgs) -> Result<BlockIndex, String> {
        ic_cdk::println!(
            "Transferring {} tokens to account {}",
            &args.amount,
            &args.to_account,
        );

        let transfer_from_args = TransferFromArgs {
            from: Account::from(ic_cdk::caller()),
            memo: None,
            amount: args.amount,
            spender_subaccount: None,
            fee: None,
            to: args.to_account,
            created_at_time: None,
        };

        // 1. Asynchronously call another canister function using `ic_cdk::call`.
        ic_cdk::call::<(TransferFromArgs,), (Result<BlockIndex, TransferFromError>,)>(
            Principal::from_text("mxzaz-hqaaa-aaaar-qaada-cai")
                .expect("Could not decode the principal."),
            "icrc2_transfer_from",
            (transfer_from_args,),
        )
        .await
        .map_err(|e| format!("failed to call ledger: {:?}", e))?
        .0
        .map_err(|e| format!("ledger transfer error {:?}", e))
    }
}
