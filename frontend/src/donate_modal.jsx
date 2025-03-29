export default function DonateModal({ setAmount, donate, isOpen }) {
    return (
        <div class={`relative z-10 ${!isOpen && 'hidden'}`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 class="text-3xl font-semibold text-gray-900" id="modal-title">Donate</h3>
                        <div className="pt-4 flex flex-col">
                            <label for="name" className="mb-2 font-medium">Amount</label>
                            <input onChange={(e) => setAmount(e.target.value, 10)} type="number" name="name" id="name" className="px-3 py-2 rounded-xl bg-gray-50 border-2 border-gray-300" />
                        </div>
                        </div>
                    </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button onClick={donate} type="button" class="inline-flex w-full justify-center rounded-md bg-[#004AAD] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto">Donate</button>
                    </div>
                </div>
                </div>
            </div>
            </div>
    )
}