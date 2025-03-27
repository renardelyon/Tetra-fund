use std::cell::RefCell;

use candid::{Nat, Principal};
use domain::{
    donation::{
        model::{
            donation::{DonationData, DonationVec},
            transfer_data::{TransferArgs, TransferRequest},
        },
        usecase::usecase::Usecase as DonationUsecase,
    },
    fundraise::{
        model::fundraise_data::{FundraiseData, FundraiseDataWithId},
        usecase::usecase::Usecase as FundraiseUsecase,
    },
};
use ic_ledger_types::{BlockIndex, Tokens};
use ic_stable_structures::{
    memory_manager::{MemoryId, MemoryManager, VirtualMemory},
    DefaultMemoryImpl, StableBTreeMap,
};
use icrc_ledger_types::icrc1::transfer::BlockIndex as BlockIndexType;

pub mod domain;

type VMem = VirtualMemory<DefaultMemoryImpl>;
type FundraiseDataType = StableBTreeMap<Principal, FundraiseData, VMem>;
type DonationListMap = StableBTreeMap<Principal, DonationVec, VMem>;
const FUNDRAISE_MEM_ID: MemoryId = MemoryId::new(0);
const DONATION_LIST_MEM_ID: MemoryId = MemoryId::new(1);

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

    static DONATION_STATE: RefCell<DonationListState> = MM.with(|cell|{
        let mm = cell.borrow();
        let donation_data = DonationListMap::init(mm.get(DONATION_LIST_MEM_ID));
        RefCell::new(DonationListState {
            donation_data,
         })
    });
}

struct FundraiseState {
    fundraise_data: FundraiseDataType,
}

struct DonationListState {
    donation_data: DonationListMap,
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

#[ic_cdk::query]
fn get_donation_list_len(receiver: Principal) -> Result<usize, String> {
    let usecase = DonationUsecase::new();
    usecase.get_donation_list_len(&receiver)
}

#[ic_cdk::query]
fn get_donation_list(receiver: Principal) -> Result<Vec<DonationData>, String> {
    let usecase = DonationUsecase::new();
    usecase.get_donation_list(&receiver)
}

#[ic_cdk::update]
async fn donate(receiver: Principal, amount: Tokens) -> Result<Nat, String> {
    let usecase = DonationUsecase::new();
    usecase.donate(&receiver, amount).await
}

// Export the interface for the smart contract.
ic_cdk::export_candid!();
