use candid::{CandidType, Principal};
use ic_ledger_types::{Subaccount, Tokens};
use icrc_ledger_types::icrc1::{account::Account, transfer::NumTokens};
use serde::{Deserialize, Serialize};

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct TransferRequest {
    pub amount: Tokens,
    pub to_principal: Principal,
    pub to_subaccount: Option<Subaccount>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct TransferArgs {
    pub amount: NumTokens,
    pub to_account: Account,
}
