import { useContext, useEffect, useMemo, useState } from 'react';
import { backend } from '../../src/declarations/backend/index.js';
import { LoginContext } from './App';
import { Principal } from '@dfinity/principal';

export default function Donation() {
    const urlParams = useMemo(() => new URLSearchParams(window.location.search));
    const { actor } = useContext(LoginContext);
    const [imgSrc, setImgSrc] = useState()
    const [fundraiseData, setFundraiseData] = useState([])
    const [totalAmount, setTotalAmount] = useState(0)

    async function get_data() {  
        const res = await actor.get_bulk_fundraise_data(10)
        const dataProcessed = []

        for (const {fundraise_data, id} of res.Ok) {
            const userId = Principal.fromUint8Array(id._arr).toText()
            const res = await actor.get_base64_image(id)
            setImgSrc({
                [userId]: res.Ok
            })

            const donations = await actor.get_donation_list(id);
            const totalAmount = donations.Ok.reduce((acc, curr, _) => acc + Number(curr.amount), 0)

            let data = {
                goal: fundraise_data.goal,
                description: fundraise_data.description,
                campaign_title: fundraise_data.campaign_title,
                category: fundraise_data.category,
                location: fundraise_data.location,
                userId,
                totalAmount
            }
            dataProcessed.push(data)
        }

        setFundraiseData(dataProcessed)
    }

    function redirectToDetail(data) {
        return function () {
            let query = new URLSearchParams(data)
            let queryString = query.toString();
            window.location.href = `/donation/detail?${queryString}`
        }
    }

    useEffect(() => {
      if (actor) {
        get_data()
      }
    },[actor])

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
                    { (fundraiseData || []).map((data, index) => (
                            <div className='grow' key={index} onClick={redirectToDetail(data)}>
                                <img className='h-64 bg-gray-500 rounded-2xl' src={(imgSrc || {[data.userId]: ''})[data.userId]} />
                                <p className='my-4 font-bold'>{ data.campaign_title }</p>
                                <div className='h-4 bg-gray-200 rounded-full'>
                                    <div className={`h-4 w-[${(Number(data.goal) - Number(data.totalAmount))/Number(data.goal)*100}%] bg-blue-800 rounded-full`}></div>
                                </div>
                                <p className='mt-2'>ICP {data.goal.toString()} raised</p>
                            </div>
                        )) 
                    }
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