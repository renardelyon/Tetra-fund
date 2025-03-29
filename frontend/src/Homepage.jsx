export default function Homepage() {
    return (
        <main>
            <section className='flex flex-col px-8 py-16 mt-16'>
                <h1 className='text-[4rem] font-medium text-center'>
                    A Warm Welcome to <br/>
                    Those Who <span className='text-blue-800'>Care</span>
                </h1>
                <p className='my-8 text-center'>
                    Welcome to <strong>Tetra Fund</strong>, where kindness creates change. Your generousity brings hope, shelter, and <br/>
                    opportunity to those in need. Together, we can make a lasting impact - one act at a time.
                </p>
                <div className='flex flex-row justify-center gap-16 font-medium'>
                    <button onClick={() => window.location.href = "/donation"} className='z-0 grow py-3 max-w-52 text-[1.1rem] text-white bg-blue-800 rounded-full cursor-pointer hover:scale-95 transition-transform'>Donate Now</button>
                    <button onClick={() => window.location.href = "/fundraise"} className='z-0 grow py-3 max-w-52 text-[1.1rem] rounded-full border-3 cursor-pointer hover:scale-95 transition-transform'>Start Fundraising</button>
                </div>
                <div className='flex flex-row gap-2 h-96 -mt-16 mb-8'>
                    <div className='grow bg-gray-500 rounded-xl'>image</div>
                    <div className='grow h-2/3 mt-auto bg-gray-500 rounded-xl'>image</div>
                    <div className='grow h-1/2 mt-auto bg-gray-500 rounded-xl'>image</div>
                    <div className='grow h-2/3 mt-auto bg-gray-500 rounded-xl'>image</div>
                    <div className='grow bg-gray-500 rounded-xl'>image</div>
                </div>
                <p className='text-[1.5rem] font-medium'>
                    In a world that thrives on kindness, every act of giving - big <br/>
                    or small - has the <span className='text-blue-800'>power to transform lives and create a <br/>
                    brighter future</span> to those in need.
                </p>
            </section>

            <section className='px-8 py-16 bg-gray-100'>
                <div className='text-center mb-16'>
                    <h1 className='text-[1.8rem] font-medium text-blue-800'>Start a Fundraiser</h1>
                    <h1 className='text-[2rem] font-medium '>Turn Compassion into Action</h1>
                    <p className='mt-4'>
                        Want to make an even bigger impact? Starting a fundraiser allows you to rally your <br/>
                        friends, family, and community to support a cause you care about.
                    </p>
                </div>
                <div className='flex flex-row h-96'>
                    <div className='basis-1/2 grow bg-gray-500 rounded-3xl'>image</div>
                    <div className='flex flex-col basis-1/2 grow gap-8 pl-16 m-auto'>
                        <div>
                            <h2 className='mb-2 text-[1.4rem] font-medium text-blue-800'>Multiple your Impact</h2>
                            <p className='max-w-96'>Inspire others to give and create a ripple effect of generousity.</p>
                        </div>
                        <div>
                            <h2 className='mb-2 text-[1.4rem] font-medium text-blue-800'>Support a Cause You Love</h2>
                            <p className='max-w-96'>Raise funds for causes close to your heart, from education to emergency relief.</p>
                        </div>
                        <div>
                            <h2 className='mb-2 text-[1.4rem] font-medium text-blue-800'>Make Giving Easy</h2>
                            <p className='max-w-96'>Our platform makes it simple to set up and share your fundraiser.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className='px-8 py-16'>
                <div className='text-center mb-16'>
                    <h1 className='text-[1.8rem] font-medium'>No Fundraiser?</h1>
                    <h1 className='text-[2rem] font-medium'>No Problem - <span className='text-blue-800'>You Can Still Help!</span></h1>
                    <p className='mt-4'>
                        Not ready to start a fundraiser? You can still make a difference with a direct donation.<br/>
                        Every contribution, big or small, brings hope and change.
                    </p>
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
                <div className='flex justify-end'>
                    <button className='px-8 py-3 font-medium text-white bg-blue-800 rounded-full cursor-pointer hover:scale-95 transition-transform'>
                        Discover More
                    </button>
                </div>
            </section>

            <section className='px-8 py-16 bg-gray-100'>
                <div className='text-center mb-16'>
                    <h1 className='text-[2rem] font-medium'><span className='text-blue-800'>Join Us</span> in Making a Difference</h1>
                    <p className='mt-4'>
                    Every act of kindness matters. Whether you donate, start a fundraiser, or simply spread the word,<br/>
                    you're helping create real change. Together, we can support those in need and build a brighter future.
                    </p>
                    <p className='mt-4 font-medium text-blue-800'>Ready to make an impact?</p>
                </div>
                <div className='flex flex-row justify-center gap-16 font-medium'>
                    <button onClick={() => window.location.href = "/donation"} className='grow py-3 max-w-52 text-[1.1rem] text-white bg-blue-800 rounded-full cursor-pointer hover:scale-95 transition-transform'>Donate Now</button>
                    <button onClick={() => window.location.href = "/fundraise"} className='grow py-3 max-w-52 text-[1.1rem] rounded-full border-3 cursor-pointer hover:scale-95 transition-transform'>Start Fundraising</button>
                </div>
            </section>
        </main>
    );
}