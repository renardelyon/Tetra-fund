use std::cell::RefCell;

use candid::{Nat, Principal};
use domain::{
    donation::{
        model::donation::{DonationData, DonationVec},
        usecase::usecase::Usecase as DonationUsecase,
    },
    fundraise::{
        model::fundraise_data::{FundraiseData, FundraiseDataWithId},
        usecase::usecase::Usecase as FundraiseUsecase,
    },
};
use ic_cdk::api::call::CallResult;
use ic_ledger_types::Tokens;
use ic_ledger_types::{
    query_archived_blocks, query_blocks, AccountIdentifier, Block, BlockIndex, GetBlocksArgs,
    Operation, DEFAULT_SUBACCOUNT,
};
use ic_stable_structures::{
    memory_manager::{MemoryId, MemoryManager, VirtualMemory},
    DefaultMemoryImpl, StableBTreeMap,
};

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

#[ic_cdk::update]
async fn query_one_block(
    ledger: Principal,
    user: Principal,
    block_index: BlockIndex,
) -> CallResult<Vec<Block>> {
    let args = GetBlocksArgs {
        start: block_index,
        length: 10,
    };

    let blocks_result = query_blocks(ledger, args.clone()).await.unwrap();

    let block_filter_closure = |b: &Block| {
        if let Some(op) = &b.transaction.operation {
            if let Operation::Transfer {
                from,
                to,
                amount: _,
                fee: _,
            } = op
            {
                if AccountIdentifier::new(&user, &DEFAULT_SUBACCOUNT) == *from
                    || AccountIdentifier::new(&user, &DEFAULT_SUBACCOUNT) == *to
                {
                    return true;
                }
            }
        }
        false
    };

    if blocks_result.blocks.len() >= 1 {
        debug_assert_eq!(blocks_result.first_block_index, block_index);
        return Ok(blocks_result
            .blocks
            .into_iter()
            .filter(block_filter_closure)
            .collect());
    }

    if let Some(func) = blocks_result.archived_blocks.into_iter().find_map(|b| {
        (b.start <= block_index && (block_index - b.start) < b.length).then(|| b.callback)
    }) {
        match query_archived_blocks(&func, args).await.unwrap() {
            Ok(range) => {
                return Ok(range
                    .blocks
                    .into_iter()
                    .filter(block_filter_closure)
                    .collect())
            }
            _ => (),
        }
    }
    Ok(vec![])
}

// Export the interface for the smart contract.
ic_cdk::export_candid!();
