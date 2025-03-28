use std::{borrow::Cow, collections::HashMap};

use candid::{CandidType, Decode, Encode};
use ic_stable_structures::{storable::Bound, Storable};
use serde::{Deserialize, Serialize};

pub type Blob = Vec<u8>;
pub type UserFiles = HashMap<String, File>;

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct FileChunk {
    pub index: u64,
    pub data: Blob,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct File {
    pub name: String,
    pub chunks: Vec<FileChunk>,
    pub total_size: u64,
    pub file_type: String,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct FileMetadata {
    pub name: String,
    pub total_size: u64,
    pub file_type: String,
}

impl Storable for File {
    const BOUND: Bound = Bound::Unbounded;
    fn from_bytes(bytes: Cow<'_, [u8]>) -> Self {
        Decode!(&bytes, File).expect("failed to deserialize DayDataEntry")
    }
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        Encode!(&self)
            .expect("failed to serialize DayDataEntry")
            .into()
    }
}
