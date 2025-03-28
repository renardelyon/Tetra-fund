use candid::Principal;

use crate::{
    domain::fundraise::model::fundraise_data::{FundraiseData, FundraiseDataWithId},
    FUNDRAISE_STATE,
};

use super::usecase::Usecase;

impl Usecase {
    pub fn get_bulk_fundraise_data(&self, n: usize) -> Result<Vec<FundraiseDataWithId>, String> {
        FUNDRAISE_STATE.with(|state| {
            let state = state.borrow();
            let result = state
                .fundraise_data
                .iter()
                .rev()
                .take(n)
                .map(|(k, v)| FundraiseDataWithId {
                    id: k.clone(),
                    fundraise_data: v.clone(),
                })
                .collect();
            Ok(result)
        })
    }

    pub fn get_fundraise_data_by_principal_id(
        &self,
        principal_id: &Principal,
    ) -> Option<FundraiseData> {
        FUNDRAISE_STATE.with(|state| {
            let state = state.borrow();
            state.fundraise_data.get(principal_id)
        })
    }
}
