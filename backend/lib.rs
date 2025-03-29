use base64::{engine::general_purpose::STANDARD, Engine as _};
use std::borrow::Cow;
use std::cell::RefCell;

use std::collections::HashMap;

use candid::{CandidType, Decode, Deserialize, Encode, Principal};
use ic_stable_structures::storable::Bound;
use ic_stable_structures::Storable;
use ic_stable_structures::{
    memory_manager::{MemoryId, MemoryManager, VirtualMemory},
    DefaultMemoryImpl, StableBTreeMap,
};

#[derive(PartialEq, Eq, PartialOrd, Ord, CandidType, Deserialize, Clone, Debug)]
struct FileKey(Principal, String);

impl Storable for FileKey {
    const BOUND: Bound = Bound::Unbounded;
    fn from_bytes(bytes: Cow<'_, [u8]>) -> Self {
        Decode!(&bytes, FileKey).expect("failed to deserialize")
    }
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        Encode!(&self).expect("failed to serialize").into()
    }
}

type VMem = VirtualMemory<DefaultMemoryImpl>;
type FundraiseDataType = StableBTreeMap<Principal, FundraiseData, VMem>;
type DonationListMap = StableBTreeMap<Principal, DonationVec, VMem>;
type FileStorage = StableBTreeMap<FileKey, File, VMem>;

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

#[derive(Debug, Clone, CandidType, Deserialize, Default)]
pub struct FundraiseData {
    pub campaign_title: String,
    pub goal: u64,
    pub category: String,
    pub description: String,
    pub location: String,
}

impl Storable for FundraiseData {
    const BOUND: Bound = Bound::Unbounded;
    fn from_bytes(bytes: Cow<'_, [u8]>) -> Self {
        Decode!(&bytes, FundraiseData).expect("failed to deserialize")
    }
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        Encode!(&self).expect("failed to serialize").into()
    }
}

#[derive(Debug, Clone, CandidType, Deserialize)]
pub struct FundraiseDataWithId {
    pub id: Principal,
    pub fundraise_data: FundraiseData,
}

struct FundraiseState {
    fundraise_data: FundraiseDataType,
}

#[derive(CandidType, Deserialize, Clone, Debug, Default)]
pub struct DonationVec(pub Vec<DonationData>);

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct DonationData {
    pub amount: u64,
    pub donor: Principal,
    pub timestamp: u64,
}

impl Storable for DonationVec {
    const BOUND: Bound = Bound::Unbounded;
    fn from_bytes(bytes: Cow<'_, [u8]>) -> Self {
        Decode!(&bytes, DonationVec).expect("failed to deserialize")
    }
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        Encode!(&self).expect("failed to serialize").into()
    }
}

struct DonationListState {
    donation_data: DonationListMap,
}

pub type Blob = Vec<u8>;
pub type UserFiles = HashMap<String, File>;

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct FileChunk {
    pub index: u64,
    pub data: Blob,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct File {
    pub name: String,
    pub chunks: Vec<FileChunk>,
    pub total_size: u64,
    pub file_type: String,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct FileMetadata {
    pub name: String,
    pub total_size: u64,
    pub file_type: String,
}

impl Storable for File {
    const BOUND: Bound = Bound::Unbounded;
    fn from_bytes(bytes: Cow<'_, [u8]>) -> Self {
        Decode!(&bytes, File).expect("failed to deserialize")
    }
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        Encode!(&self).expect("failed to serialize").into()
    }
}

struct FileStorageState {
    file_storage: FileStorage,
}

#[ic_cdk::update]
fn create_fundraise(args: FundraiseData) -> Result<String, String> {
    FUNDRAISE_STATE.with(|state| {
        let mut state = state.borrow_mut();

        let user = ic_cdk::caller();
        let mut fundraise_data = state.fundraise_data.get(&user).unwrap_or_default();

        fundraise_data.campaign_title = args.campaign_title.clone();
        fundraise_data.goal = args.goal;
        fundraise_data.category = args.category.clone();
        fundraise_data.description = args.description.clone();
        fundraise_data.location = args.location.clone();

        state.fundraise_data.insert(user, fundraise_data);
        Ok(format!(
            "Fundraise data with title: {} stored successfully",
            args.campaign_title
        ))
    })
}

#[ic_cdk::query]
fn get_bulk_fundraise_data(n: usize) -> Result<Vec<FundraiseDataWithId>, String> {
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

#[ic_cdk::query]
fn get_fundraise_data_by_principal_id(fundraise_user: Principal) -> Result<FundraiseData, String> {
    FUNDRAISE_STATE.with(|state| {
        let state = state.borrow();
        match state.fundraise_data.get(&fundraise_user) {
            Some(data) => Ok(data),
            None => Err("No data found".to_string()),
        }
    })
}

#[ic_cdk::query]
fn get_donation_list_len(receiver: Principal) -> Result<usize, String> {
    DONATION_STATE.with(|state| {
        let state = state.borrow();
        let len = state.donation_data.get(&receiver).map_or(0, |d| d.0.len());
        Ok(len)
    })
}

#[ic_cdk::query]
fn get_donation_list(receiver: Principal) -> Result<Vec<DonationData>, String> {
    DONATION_STATE.with(|state| {
        let state = state.borrow();
        let donation_list = state.donation_data.get(&receiver).map_or(vec![], |d| d.0);
        Ok(donation_list)
    })
}

#[ic_cdk::update]
async fn donate(receiver: Principal, amount: u64) -> Result<String, String> {
    DONATION_STATE.with(|state| {
        let donor = ic_cdk::caller();
        let mut state = state.borrow_mut();
        let mut donation_list = state.donation_data.get(&receiver).unwrap_or_default();

        let now = ic_cdk::api::time();

        let new_donation = DonationData {
            amount,
            donor,
            timestamp: now,
        };
        donation_list.0.push(new_donation);
        state.donation_data.insert(receiver, donation_list);
        Ok(format!("{} donate to {}", amount, receiver))
    })
}

#[ic_cdk::query]
fn get_user_files(user: Principal) -> Result<UserFiles, String> {
    FILE_STORAGE.with(|state| {
        let mut hashmap: HashMap<String, File> = HashMap::new();
        let state = state.borrow();
        let filtered_iter = state
            .file_storage
            .iter()
            .filter(|(FileKey(k, _), _)| *k == user);

        for (FileKey(_, file_name), file_data) in filtered_iter {
            hashmap.insert(file_name, file_data);
        }

        Ok(hashmap)
    })
}

#[ic_cdk::query]
fn check_file_exists(file_name: String) -> bool {
    FILE_STORAGE.with(|state| {
        let state = state.borrow();
        state
            .file_storage
            .contains_key(&FileKey(ic_cdk::caller(), file_name.clone()))
    })
}

#[ic_cdk::update]
fn upload_file(name: String, chunk: Blob, index: u64, file_type: String) -> Result<String, String> {
    FILE_STORAGE.with(|state| {
        let file_length = chunk.len();
        let file_chunk = FileChunk { index, data: chunk };

        let caller = ic_cdk::caller();
        let mut state = state.borrow_mut();
        let mut file_data = state
            .file_storage
            .range(FileKey(caller, name.clone())..)
            .take_while(|(FileKey(k, n), _)| *k == caller && *n == name);

        let data = file_data.next();

        match data {
            Some((FileKey(p, n), mut f)) => {
                f.chunks.push(file_chunk);
                f.total_size += file_length as u64;
                state.file_storage.insert(FileKey(p, n), f);
            }
            None => {
                let file = File {
                    name: name.clone(),
                    chunks: vec![file_chunk],
                    total_size: file_length as u64,
                    file_type,
                };

                state.file_storage.insert(FileKey(caller, name), file);
            }
        }
        Ok(format!("File uploaded successfully"))
    })
}

#[ic_cdk::query]
fn get_files() -> Result<Vec<FileMetadata>, String> {
    FILE_STORAGE.with(|state| {
        let state = state.borrow();
        let result = state
            .file_storage
            .iter()
            .filter(|(FileKey(k, _), _)| *k == ic_cdk::caller())
            .map(|(FileKey(_, n), v)| FileMetadata {
                name: n.clone(),
                total_size: v.total_size,
                file_type: v.file_type.clone(),
            })
            .collect();
        Ok(result)
    })
}

#[ic_cdk::query]
fn get_total_chunks(file_name: String) -> Result<u64, String> {
    FILE_STORAGE.with(|state| {
        let state = state.borrow();
        let file = state
            .file_storage
            .get(&FileKey(ic_cdk::caller(), file_name.clone()));
        match file {
            Some(f) => Ok(f.chunks.len() as u64),
            None => Err(format!("File {} not found", file_name)),
        }
    })
}

#[ic_cdk::query]
fn get_file_chunk(file_name: String, index: u64) -> Result<Blob, String> {
    FILE_STORAGE.with(|state| {
        let state = state.borrow();
        let file = state
            .file_storage
            .get(&FileKey(ic_cdk::caller(), file_name.clone()));
        match file {
            Some(f) => {
                let chunk = f.chunks.get(index as usize);
                match chunk {
                    Some(c) => Ok(c.data.clone()),
                    None => Err(format!("Chunk {} not found", index)),
                }
            }
            None => Err(format!("File {} not found", file_name)),
        }
    })
}

#[ic_cdk::query]
fn get_file_type(file_name: String) -> Result<String, String> {
    FILE_STORAGE.with(|state| {
        let state = state.borrow();
        let file = state
            .file_storage
            .get(&FileKey(ic_cdk::caller(), file_name.clone()));
        match file {
            Some(f) => Ok(f.file_type.clone()),
            None => Err(format!("File {} not found", file_name)),
        }
    })
}

#[ic_cdk::query]
fn get_base64_image(user: Principal) -> Result<String, String> {
    FILE_STORAGE.with(|state| {
        let state = state.borrow();
        let mut storage_iter = state.file_storage.iter().filter(|(key, _)| key.0 == user);

        if let Some((_, f)) = storage_iter.next() {
            let res: Vec<u8> = f
                .chunks
                .into_iter()
                .flat_map(|fchunk| fchunk.data)
                .collect();

            let base64_str = STANDARD.encode(res);

            return Ok(format!("data:image/{};base64,{}", f.file_type, base64_str));
        }

        return Err("File Empty".to_string());
    })
}

// Export the interface for the smart contract.
ic_cdk::export_candid!();
