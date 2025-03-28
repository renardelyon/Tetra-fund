export default function Donation() {
    return (
        <main>
            <section className='flex flex-col px-8 py-16 mt-16 border-b-2 border-gray-200'>
                <h1 className='text-[4rem] font-medium text-center'>
                    Make a Difference <span className='text-blue-800'>Today</span>
                </h1>
                <p className='mt-8 text-center'>Your generousity can change lives. Choose a cause and donate now.</p>
            </section>

            <section className='px-8 py-16'>
                <div className="flex flex-row justify-between mb-8 font-medium">
                    <h2 className="text-[2rem]">Education Fundraisers</h2>
                    <a href="#" className="text-gray-400">See More</a>
                </div>
                <div className='flex flex-row gap-4'>
                    <div className='grow'>
                        <div className='h-64 bg-gray-500 rounded-2xl'>image</div>
                        <p className='my-4 font-bold'>Flood Relief for Families in Central Java</p>
                        <div className='h-4 bg-gray-200 rounded-full'>
                            <div className='h-4 w-1/3 bg-blue-800 rounded-full'></div>
                        </div>
                        <p className='mt-2'>Rp 10.000.000 raised</p>
                    </div>
                    <div className='grow'>
                        <div className='h-64 bg-gray-500 rounded-2xl'>image</div>
                        <p className='my-4 font-bold'>Bringing Digital Learning to Remote Villages</p>
                        <div className='h-4 bg-gray-200 rounded-full'>
                            <div className='h-4 w-1/3 bg-blue-800 rounded-full'></div>
                        </div>
                        <p className='mt-2'>Rp 10.000.000 raised</p>
                    </div>
                    <div className='grow'>
                        <div className='h-64 bg-gray-500 rounded-2xl'>image</div>
                        <p className='my-4 font-bold'>Support Life-Saving Surgery for Baby Aulia</p>
                        <div className='h-4 bg-gray-200 rounded-full'>
                            <div className='h-4 w-1/3 bg-blue-800 rounded-full'></div>
                        </div>
                        <p className='mt-2'>Rp 10.000.000 raised</p>
                    </div>
                </div>
            </section>

            <section className='px-8 py-16'>
                <div className="flex flex-row justify-between mb-8 font-medium">
                    <h2 className="text-[2rem]">Medical Fundraisers</h2>
                    <a href="#" className="text-gray-400">See More</a>
                </div>
                <div className='flex flex-row gap-4'>
                    <div className='grow'>
                        <div className='h-64 bg-gray-500 rounded-2xl'>image</div>
                        <p className='my-4 font-bold'>Flood Relief for Families in Central Java</p>
                        <div className='h-4 bg-gray-200 rounded-full'>
                            <div className='h-4 w-1/3 bg-blue-800 rounded-full'></div>
                        </div>
                        <p className='mt-2'>Rp 10.000.000 raised</p>
                    </div>
                    <div className='grow'>
                        <div className='h-64 bg-gray-500 rounded-2xl'>image</div>
                        <p className='my-4 font-bold'>Bringing Digital Learning to Remote Villages</p>
                        <div className='h-4 bg-gray-200 rounded-full'>
                            <div className='h-4 w-1/3 bg-blue-800 rounded-full'></div>
                        </div>
                        <p className='mt-2'>Rp 10.000.000 raised</p>
                    </div>
                    <div className='grow'>
                        <div className='h-64 bg-gray-500 rounded-2xl'>image</div>
                        <p className='my-4 font-bold'>Support Life-Saving Surgery for Baby Aulia</p>
                        <div className='h-4 bg-gray-200 rounded-full'>
                            <div className='h-4 w-1/3 bg-blue-800 rounded-full'></div>
                        </div>
                        <p className='mt-2'>Rp 10.000.000 raised</p>
                    </div>
                </div>
            </section>

            <section className='px-8 py-16'>
                <div className="flex flex-row justify-between mb-8 font-medium">
                    <h2 className="text-[2rem]">Emergency Fundraisers</h2>
                    <a href="#" className="text-gray-400">See More</a>
                </div>
                <div className='flex flex-row gap-4'>
                    <div className='grow'>
                        <div className='h-64 bg-gray-500 rounded-2xl'>image</div>
                        <p className='my-4 font-bold'>Flood Relief for Families in Central Java</p>
                        <div className='h-4 bg-gray-200 rounded-full'>
                            <div className='h-4 w-1/3 bg-blue-800 rounded-full'></div>
                        </div>
                        <p className='mt-2'>Rp 10.000.000 raised</p>
                    </div>
                    <div className='grow'>
                        <div className='h-64 bg-gray-500 rounded-2xl'>image</div>
                        <p className='my-4 font-bold'>Bringing Digital Learning to Remote Villages</p>
                        <div className='h-4 bg-gray-200 rounded-full'>
                            <div className='h-4 w-1/3 bg-blue-800 rounded-full'></div>
                        </div>
                        <p className='mt-2'>Rp 10.000.000 raised</p>
                    </div>
                    <div className='grow'>
                        <div className='h-64 bg-gray-500 rounded-2xl'>image</div>
                        <p className='my-4 font-bold'>Support Life-Saving Surgery for Baby Aulia</p>
                        <div className='h-4 bg-gray-200 rounded-full'>
                            <div className='h-4 w-1/3 bg-blue-800 rounded-full'></div>
                        </div>
                        <p className='mt-2'>Rp 10.000.000 raised</p>
                    </div>
                </div>
            </section>

            <section className='px-8 py-16 text-center'>
                <a href="#" className='px-8 py-3 text-[1.5rem] font-medium text-gray-500 rounded-full border-3 border-gray-500'>
                    Discover More
                </a>
            </section>
        </main>
    );
}