use std::borrow::Cow;

use candid::{CandidType, Decode, Encode, Principal};
use ic_stable_structures::{storable::Bound, Storable};
use serde::Deserialize;

#[derive(Debug, Clone, CandidType, Deserialize, Default)]
pub struct FundraiseData {
    pub campaign_title: String,
    pub goal: u64,
    pub category: String,
    pub description: String,
    pub location: String,
    pub image: String,
}

impl Storable for FundraiseData {
    const BOUND: Bound = Bound::Unbounded;
    fn from_bytes(bytes: Cow<'_, [u8]>) -> Self {
        Decode!(&bytes, FundraiseData).expect("failed to deserialize DayDataEntry")
    }
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        Encode!(&self)
            .expect("failed to serialize DayDataEntry")
            .into()
    }
}

#[derive(Debug, Clone, CandidType, Deserialize)]
pub struct FundraiseDataWithId {
    pub id: Principal,
    pub fundraise_data: FundraiseData,
}
