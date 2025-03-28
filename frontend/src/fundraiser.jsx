export default function Fundraiser() {
    return (
        <main>
            <section className='flex flex-col px-8 py-16 mt-16 border-b-2 border-gray-200'>
                <h1 className='text-[4rem] font-medium text-center'>
                    Start Your Fundraiser
                </h1>
                <p className='mt-8 text-center'>Make a difference by creating a campaign for a cause you care about.</p>
            </section>

            <section className="px-8 py-16">
                <form action="#" method="post">
                    <div className="mb-12">
                        <h2 className="mb-6 text-[1.5rem] font-medium">Fundraiser Details</h2>
                        <div className="flex flex-row gap-8 mb-4">
                            <div className="basis-1/2 grow flex flex-col">
                                <label for="name" className="mb-2 font-medium">Campaign Title</label>
                                <input type="text" name="name" id="name" className="px-3 py-2 rounded-xl bg-gray-50 border-2 border-gray-300" />
                            </div>
                            <div className="basis-1/2 grow flex flex-col">
                                <label for="name" className="mb-2 font-medium">Fundraising Goal</label>
                                <input type="text" name="name" id="name" className="px-3 py-2 rounded-xl bg-gray-50 border-2 border-gray-300" />
                            </div>
                        </div>
                        <div className="flex flex-row gap-8">
                            <div className="basis-1/2 grow flex flex-col">
                                <label for="name" className="mb-2 font-medium">Category</label>
                                <input type="text" name="name" id="name" className="px-3 py-2 rounded-xl bg-gray-50 border-2 border-gray-300" />
                                </div>
                            <div className="basis-1/2 grow flex flex-col">
                                <label for="name" className="mb-2 font-medium">Location</label>
                                <input type="text" name="name" id="name" className="px-3 py-2 rounded-xl bg-gray-50 border-2 border-gray-300" />
                                </div>
                        </div>
                    </div>
                    <div className="flex flex-col mb-12">
                        <h2 className="mb-6 text-[1.5rem] font-medium">Add Media</h2>
                        <div className="relative">
                            <input type="file" name="name" id="name" className="absolute inset-0 p-4 rounded-2xl border-2 border-gray-300 border-dashed" multiple/>
                            <div className="flex flex-col justify-center h-64 text-center">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-full my-4 h-16"
                                    >
                                    <path
                                        d="M11 14.9861C11 15.5384 11.4477 15.9861 12 15.9861C12.5523 15.9861 13 15.5384 13 14.9861V7.82831L16.2428 11.0711L17.657 9.65685L12.0001 4L6.34326 9.65685L7.75748 11.0711L11 7.82854V14.9861Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M4 14H6V18H18V14H20V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V14Z"
                                        fill="currentColor"
                                    />
                                </svg>
                                <p className="font-medium">Click to upload or drag and drop</p>
                                <p>SVG, PNG, or JPG (max. 2 MB)</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col mb-12">
                        <div className="mb-6">
                            <h2 className="text-[1.5rem] font-medium">Campaign Description</h2>
                            <p>Tell your story. Why is this cause important? Share the story behind it.</p>
                        </div>
                        <textarea name="name" id="name" className="px-3 py-2 rounded-xl bg-gray-50 border-2 border-gray-300"></textarea>
                    </div>
                    <div className="flex flex-col mb-12">
                        <div className="mb-6">
                            <h2 className="text-[1.5rem] font-medium">Payment Information</h2>
                            <p>Where should the funds go?</p>
                        </div>
                        <div className="flex flex-col mb-2">
                            <label for="name" className="mb-2 font-medium">Your Bank Account Name</label>
                            <input type="text" name="name" id="name" className="px-3 py-2 rounded-xl bg-gray-50 border-2 border-gray-300" />
                        </div>
                        <div className="flex flex-col">
                            <label for="name" className="mb-2 font-medium">Your Bank Account Number</label>
                            <input type="text" name="name" id="name" className="px-3 py-2 rounded-xl bg-gray-50 border-2 border-gray-300" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 mb-12 font-medium">
                        <div className="flex flex-row">
                            <input type="checkbox" id="name" name="name" className="w-6 h-6"/>
                            <label for="name" className="ml-4">I confirm that all information provided is accurate.</label>
                        </div>
                        <div className="flex flex-row">
                            <input type="checkbox" id="name" name="name" className="w-6 h-6"/>
                            <label for="name" className="ml-4">
                                I agree to the <a href="#" className="text-blue-800">Terms</a> and <a href="#" className="text-blue-800">Privacy Policy</a>
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="w-full py-3 text-[1.1rem] font-medium text-white bg-blue-800 rounded-full">
                        Submit
                    </button>
                </form>
            </section>
        </main>
    );
}