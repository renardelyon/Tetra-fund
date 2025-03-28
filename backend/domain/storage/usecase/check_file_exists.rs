use crate::FILE_STORAGE;

use super::usecase::Usecase;

impl Usecase {
    pub fn check_file_exists(&self, file_name: String) -> bool {
        FILE_STORAGE.with(|state| {
            let state = state.borrow();
            state
                .file_storage
                .contains_key(&(ic_cdk::caller(), file_name.clone()))
        })
    }
}
