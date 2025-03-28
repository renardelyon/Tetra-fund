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
    storage::{
        model::file::{Blob, File, FileMetadata, UserFiles},
        usecase::usecase::Usecase as StorageUsecase,
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
type FileStorage = StableBTreeMap<(Principal, String), File, VMem>;

const FUNDRAISE_MEM_ID: MemoryId = MemoryId::new(0);
const DONATION_LIST_MEM_ID: MemoryId = MemoryId::new(1);
const FILE_STORAGE_MEM_ID: MemoryId = MemoryId::new(2);

thread_local! {
    static MM: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static FUNDRAISE_STATE: RefCell<FundraiseState> = MM.with(|cell|{
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

    static FILE_STORAGE: RefCell<FileStorageState> = MM.with(|cell|{
        let mm = cell.borrow();
        let file_storage = FileStorage::init(mm.get(FILE_STORAGE_MEM_ID));
        RefCell::new(FileStorageState {
            file_storage,
         })
    });
}

struct FundraiseState {
    fundraise_data: FundraiseDataType,
}

struct DonationListState {
    donation_data: DonationListMap,
}

struct FileStorageState {
    file_storage: FileStorage,
}

#[ic_cdk::update]
fn create_fundraise(args: FundraiseData) -> Result<String, String> {
    let usecase = FundraiseUsecase::new();
    usecase.store_fundraise_data(&args)
}

#[ic_cdk::query]
fn get_bulk_fundraise_data(n: usize) -> Result<Vec<FundraiseDataWithId>, String> {
    let usecase = FundraiseUsecase::new();
    usecase.get_bulk_fundraise_data(n)
}

#[ic_cdk::query]
fn get_fundraise_data_by_principal_id(fundraise_user: Principal) -> Result<FundraiseData, String> {
    let usecase = FundraiseUsecase::new();
    match usecase.get_fundraise_data_by_principal_id(&fundraise_user) {
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

#[ic_cdk::query]
fn get_user_files(user: Principal) -> Result<UserFiles, String> {
    let usecase = StorageUsecase::new();
    usecase.get_user_files(user)
}

#[ic_cdk::query]
fn check_file_exists(file_name: String) -> bool {
    let usecase = StorageUsecase::new();
    usecase.check_file_exists(file_name)
}

#[ic_cdk::update]
fn upload_file(name: String, chunk: Blob, index: u64, file_type: String) -> Result<String, String> {
    let usecase = StorageUsecase::new();
    usecase.upload_file(name, chunk, index, file_type)
}

#[ic_cdk::query]
fn get_files() -> Result<Vec<FileMetadata>, String> {
    let usecase = StorageUsecase::new();
    usecase.get_files()
}

#[ic_cdk::query]
fn get_total_chunks(file_name: String) -> Result<u64, String> {
    let usecase = StorageUsecase::new();
    usecase.get_total_chunks(file_name)
}

#[ic_cdk::query]
fn get_file_chunk(file_name: String, index: u64) -> Result<Blob, String> {
    let usecase = StorageUsecase::new();
    usecase.get_file_chunk(file_name, index)
}

#[ic_cdk::query]
fn get_file_type(file_name: String) -> Result<String, String> {
    let usecase = StorageUsecase::new();
    usecase.get_file_type(file_name)
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
