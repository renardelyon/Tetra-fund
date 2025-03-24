use candid::{CandidType, Principal};
use ic_ledger_types::{Subaccount, Tokens};
use serde::{Deserialize, Serialize};

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct TransferRequest {
    pub amount: Tokens,
    pub to_principal: Principal,
    pub to_subaccount: Option<Subaccount>,
}
