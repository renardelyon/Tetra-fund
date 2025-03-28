use std::collections::HashMap;

use candid::Principal;

use crate::{
    domain::storage::model::file::{Blob, File, FileMetadata, UserFiles},
    FILE_STORAGE,
};

use super::usecase::Usecase;

impl Usecase {
    pub fn get_user_files(&self, user: Principal) -> Result<UserFiles, String> {
        FILE_STORAGE.with(|state| {
            let mut hashmap: HashMap<String, File> = HashMap::new();
            let state = state.borrow();
            let filtered_iter = state.file_storage.iter().filter(|((k, _), _)| *k == user);

            for ((_, file_name), file_data) in filtered_iter {
                hashmap.insert(file_name, file_data);
            }

            Ok(hashmap)
        })
    }

    pub fn get_files(&self) -> Result<Vec<FileMetadata>, String> {
        FILE_STORAGE.with(|state| {
            let state = state.borrow();
            let result = state
                .file_storage
                .iter()
                .filter(|((k, _), _)| *k == ic_cdk::caller())
                .map(|((_, n), v)| FileMetadata {
                    name: n.clone(),
                    total_size: v.total_size,
                    file_type: v.file_type.clone(),
                })
                .collect();
            Ok(result)
        })
    }

    pub fn get_total_chunks(&self, file_name: String) -> Result<u64, String> {
        FILE_STORAGE.with(|state| {
            let state = state.borrow();
            let file = state
                .file_storage
                .get(&(ic_cdk::caller(), file_name.clone()));
            match file {
                Some(f) => Ok(f.chunks.len() as u64),
                None => Err(format!("File {} not found", file_name)),
            }
        })
    }

    pub fn get_file_chunk(&self, file_name: String, index: u64) -> Result<Blob, String> {
        FILE_STORAGE.with(|state| {
            let state = state.borrow();
            let file = state
                .file_storage
                .get(&(ic_cdk::caller(), file_name.clone()));
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

    pub fn get_file_type(&self, file_name: String) -> Result<String, String> {
        FILE_STORAGE.with(|state| {
            let state = state.borrow();
            let file = state
                .file_storage
                .get(&(ic_cdk::caller(), file_name.clone()));
            match file {
                Some(f) => Ok(f.file_type.clone()),
                None => Err(format!("File {} not found", file_name)),
            }
        })
    }
}
