use std::cell::RefCell;

use candid::Principal;
use domain::{
    donation::{
        model::transfer_data::TransferRequest, usecase::usecase::Usecase as DonationUsecase,
    },
    fundraise::{
        model::fundraise_data::{FundraiseData, FundraiseDataWithId},
        usecase::usecase::Usecase as FundraiseUsecase,
    },
};
use ic_ledger_types::BlockIndex;
use ic_stable_structures::{
    memory_manager::{MemoryId, MemoryManager, VirtualMemory},
    DefaultMemoryImpl, StableBTreeMap,
};

pub mod domain;

type VMem = VirtualMemory<DefaultMemoryImpl>;
type FundraiseDataType = StableBTreeMap<Principal, FundraiseData, VMem>;
const FUNDRAISE_MEM_ID: MemoryId = MemoryId::new(0);
thread_local! {
    static MM: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static STATE: RefCell<FundraiseState> = MM.with(|cell|{
        let mm = cell.borrow();
        let fundraise_data = FundraiseDataType::init(mm.get(FUNDRAISE_MEM_ID));
        RefCell::new(FundraiseState {
            fundraise_data,
         })
    });
}

struct FundraiseState {
    fundraise_data: FundraiseDataType,
}

#[ic_cdk::update]
async fn transfer(args: TransferRequest) -> Result<BlockIndex, String> {
    let usecase = DonationUsecase::new();
    usecase.transfer(&args).await
}

#[ic_cdk::update]
fn create_fundraise(user: Principal, args: FundraiseData) -> Result<String, String> {
    let usecase = FundraiseUsecase::new();
    usecase.store_fundraise_data(&user, &args)
}

#[ic_cdk::query]
fn get_bulk_fundraise_data(n: usize) -> Result<Vec<FundraiseDataWithId>, String> {
    let usecase = FundraiseUsecase::new();
    usecase.get_bulk_fundraise_data(n)
}

#[ic_cdk::query]
fn get_fundraise_data_by_principal_id(user: Principal) -> Result<FundraiseData, String> {
    let usecase = FundraiseUsecase::new();
    match usecase.get_fundraise_data_by_principal_id(&user) {
        Some(data) => Ok(data),
        None => Err("No data found".to_string()),
    }
}

// Export the interface for the smart contract.
ic_cdk::export_candid!();
