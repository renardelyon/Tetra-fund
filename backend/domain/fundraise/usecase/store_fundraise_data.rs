use crate::{domain::fundraise::model::fundraise_data::FundraiseData, FUNDRAISE_STATE};

use super::usecase::Usecase;

impl Usecase {
    pub fn store_fundraise_data(&self, args: &FundraiseData) -> Result<String, String> {
        FUNDRAISE_STATE.with(|state| {
            let mut state = state.borrow_mut();

            let user = ic_cdk::caller();
            let mut fundraise_data = state.fundraise_data.get(&user).unwrap_or_default();

            fundraise_data.campaign_title = args.campaign_title.clone();
            fundraise_data.goal = args.goal;
            fundraise_data.category = args.category.clone();
            fundraise_data.description = args.description.clone();
            fundraise_data.location = args.location.clone();
            fundraise_data.image = args.image.clone();

            state.fundraise_data.insert(user, fundraise_data);
            Ok(format!(
                "Fundraise data with title: {} stored successfully",
                args.campaign_title
            ))
        })
    }
}
