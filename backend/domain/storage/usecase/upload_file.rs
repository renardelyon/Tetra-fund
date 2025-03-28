use super::usecase::Usecase;
use crate::{
    domain::storage::model::file::{Blob, File, FileChunk},
    FILE_STORAGE,
};

impl Usecase {
    pub fn upload_file(
        &self,
        name: String,
        chunk: Blob,
        index: u64,
        file_type: String,
    ) -> Result<String, String> {
        FILE_STORAGE.with(|state| {
            let file_length = chunk.len();
            let file_chunk = FileChunk { index, data: chunk };

            let caller = ic_cdk::caller();
            let mut state = state.borrow_mut();
            let mut file_data = state
                .file_storage
                .range((caller, name.clone())..)
                .take_while(|((k, n), _)| *k == caller && *n == name);

            let data = file_data.next();

            match data {
                Some(((p, n), mut f)) => {
                    f.chunks.push(file_chunk);
                    f.total_size += file_length as u64;
                    state.file_storage.insert((p, n), f);
                }
                None => {
                    let file = File {
                        name: name.clone(),
                        chunks: vec![file_chunk],
                        total_size: file_length as u64,
                        file_type,
                    };

                    state.file_storage.insert((caller, name), file);
                }
            }
            Ok(format!("File uploaded successfully"))
        })
    }
}
