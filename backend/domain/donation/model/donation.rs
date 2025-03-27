use std::borrow::Cow;

use candid::{CandidType, Decode, Encode, Principal};
use ic_ledger_types::{Timestamp, Tokens};
use ic_stable_structures::{storable::Bound, Storable};
use serde::{Deserialize, Serialize};

#[derive(CandidType, Deserialize, Serialize, Clone, Debug, Default)]
pub struct DonationVec(pub Vec<DonationData>);

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct DonationData {
    pub amount: Tokens,
    pub donor: Principal,
    pub timestamp: Timestamp,
}

impl Storable for DonationVec {
    const BOUND: Bound = Bound::Unbounded;
    fn from_bytes(bytes: Cow<'_, [u8]>) -> Self {
        Decode!(&bytes, DonationVec).expect("failed to deserialize DayDataEntry")
    }
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        Encode!(&self)
            .expect("failed to serialize DayDataEntry")
            .into()
    }
}
