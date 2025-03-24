use domain::donation::{model::transfer_data::TransferRequest, usecase::usecase::Usecase};
use ic_ledger_types::BlockIndex;

pub mod domain;

// This update method stores the greeting prefix in stable memory.
#[ic_cdk::update]
async fn transfer(args: TransferRequest) -> Result<BlockIndex, String> {
    let usecase = Usecase::new();
    usecase.transfer(&args).await
}

// Export the interface for the smart contract.
ic_cdk::export_candid!();
